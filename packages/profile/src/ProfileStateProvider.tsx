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
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { S3ProfileModel, Profile } from "./data-model";

let s3ProfileModel: S3ProfileModel | null = null;
export const getS3ProfileModel = () => s3ProfileModel;

export interface ProfileStateContextValue {
  s3ProfileModalInitialed: boolean;
  s3ProfileModalAuthed: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  getProfileWithDid: (did: string) => Promise<Profile | null>;
}
const defaultContextValue: ProfileStateContextValue = {
  s3ProfileModalInitialed: false,
  s3ProfileModalAuthed: false,
  profile: null,
  profileLoading: false,
  getProfileWithDid: async () => null,
};
const ProfileStateContext = createContext(defaultContextValue);

export interface ProfileStateProviderProps extends PropsWithChildren {
  // ceramic host
  ceramicHost: string;
}

export default function ProfileStateProvider({
  children,
  ceramicHost,
}: ProfileStateProviderProps) {
  if (!ceramicHost) throw Error("ceramicHost is required");

  const [s3ProfileModalInitialed, setS3ProfileModalInitialed] = useState(false);
  const [s3ProfileModalAuthed, setS3ProfileModalAuthed] = useState(false);
  // TODO: Whether ceramicHost allows switching
  useEffect(() => {
    if (!s3ProfileModel) {
      s3ProfileModel = new S3ProfileModel(ceramicHost);
      setS3ProfileModalInitialed(true);
    }
  }, [ceramicHost]);

  // When the authorization is complete, query and store the profile
  const session = useSession();

  const [profile, setProfile] = useState(defaultContextValue.profile);
  const [profileLoading, setProfileLoading] = useState(true);
  useEffect(() => {
    if (!s3ProfileModel) return;
    if (session) {
      s3ProfileModel.authComposeClient(session);
      setS3ProfileModalAuthed(true);
      setProfileLoading(true);
      s3ProfileModel
        .queryPersonalProfile()
        .then((res) => {
          setProfile(res.data?.viewer?.profile || null);
        })
        .finally(() => {
          setProfileLoading(false);
        });
    } else {
      setProfile(null);
      s3ProfileModel.resetComposeClient();
      setS3ProfileModalAuthed(false);
    }
  }, [session]);

  // Create a cache when fetching other users' profiles
  const cacheOtherProfiles = useRef<Record<string, Profile | null>>({}).current;
  const getProfileWithDid = useCallback(
    async (
      did: string,
      opts?: {
        nocache?: boolean;
      }
    ) => {
      const { nocache } = opts || {};
      if (!nocache && cacheOtherProfiles[did]) return cacheOtherProfiles[did];
      const res = await s3ProfileModel?.queryProfileWithDid(did);
      const profile = res?.data?.node?.profile || null;
      if (profile) cacheOtherProfiles[did] = profile;
      return profile;
    },
    []
  );

  return (
    <ProfileStateContext.Provider
      value={useMemo(
        () => ({
          s3ProfileModalInitialed,
          s3ProfileModalAuthed,
          profile,
          profileLoading,
          getProfileWithDid,
        }),
        [
          s3ProfileModalInitialed,
          s3ProfileModalAuthed,
          profile,
          profileLoading,
          getProfileWithDid,
        ]
      )}
    >
      {children}
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
