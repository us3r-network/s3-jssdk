import {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  useCallback,
  useRef,
  PropsWithChildren,
} from "react";
import { useSession } from "@us3r-network/auth";
import S3ProfileModel, { Profile } from "./data-model";
import { Theme, ThemeMode, getTheme } from "./themes";
import { ThemeProvider } from "styled-components";

let s3ProfileModel: S3ProfileModel | null = null;
export const getS3ProfileModel = () => s3ProfileModel;

export interface ProfileStateContextValue {
  profile: Profile | null;
  getProfileWithDid: (did: string) => Promise<Profile | null>;
}
const defaultContextValue: ProfileStateContextValue = {
  profile: null,
  getProfileWithDid: async () => null,
};
const ProfileStateContext = createContext(defaultContextValue);

export interface ProfileStateProviderProps extends PropsWithChildren {
  // ceramic host
  ceramicHost: string;
  // theme config
  themeConfig?: {
    mode?: ThemeMode;
    darkTheme?: Theme;
    lightTheme?: Theme;
  };
}

export default function ProfileStateProvider({
  children,
  ceramicHost,
  themeConfig,
}: ProfileStateProviderProps) {
  if (!ceramicHost) throw Error("ceramicHost is required");

  // TODO: Whether ceramicHost allows switching
  useEffect(() => {
    if (!s3ProfileModel) {
      s3ProfileModel = new S3ProfileModel(ceramicHost);
    }
  }, [ceramicHost]);

  // When the authorization is complete, query and store the profile
  const session = useSession();
  const [profile, setProfile] = useState(defaultContextValue.profile);
  useEffect(() => {
    if (!s3ProfileModel) return;
    if (session) {
      s3ProfileModel.authComposeClient(session);
      s3ProfileModel.queryPersonalProfile().then((res) => {
        setProfile(res.data?.viewer?.profile || null);
      });
    } else {
      setProfile(null);
      s3ProfileModel.resetComposeClient();
    }
  }, [session]);

  // Create a cache when fetching other users' profiles
  const cacheOtherProfiles = useRef<Record<string, Profile | null>>({}).current;
  const getProfileWithDid = useCallback(async (did: string) => {
    if (cacheOtherProfiles[did]) return cacheOtherProfiles[did];
    const res = await s3ProfileModel?.queryProfileWithDid(did);
    const profile = res?.data?.node?.profile || null;
    if (profile) cacheOtherProfiles[did] = profile;
    return profile;
  }, []);

  return (
    <ProfileStateContext.Provider
      value={useMemo(
        () => ({
          profile,
          getProfileWithDid,
        }),
        [profile, getProfileWithDid]
      )}
    >
      <ThemeProvider theme={getTheme(themeConfig)}>{children}</ThemeProvider>
    </ProfileStateContext.Provider>
  );
}

export function useProfileState() {
  const context = useContext(ProfileStateContext);
  if (!context) {
    throw Error(
      "useProfileState can only be used within the ProfileStateProvider component"
    );
  }
  return context;
}

export function useProfileForDid(did: string) {
  const { getProfileWithDid } = useProfileState();
  const [data, setData] = useState<Profile>();
  useEffect(() => {
    getProfileWithDid(did)
      .then((data) => {
        if (data) setData(data);
      })
      .catch(console.error);
  }, [did, getProfileWithDid]);
  return data;
}

export function useProfileForDidOrSession(did: string) {
  const session = useSession();
  const { profile, getProfileWithDid } = useProfileState();
  const [data, setData] = useState<Profile>();
  useEffect(() => {
    if (did === session?.id) {
      setData({ ...profile });
      return;
    }
    getProfileWithDid(did)
      .then((data) => {
        if (data) setData(data);
      })
      .catch(console.error);
  }, [did, profile, session, getProfileWithDid]);
  return data;
}
