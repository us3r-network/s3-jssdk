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
import { S3ProfileModel, Profile } from "@us3r-network/data-model";
import { shortDid } from "./utils/short";

let s3ProfileModel: S3ProfileModel | null = null;
export const getS3ProfileModel = () => s3ProfileModel;

export interface ProfileStateContextValue {
  s3ProfileModalInitialed: boolean;
  s3ProfileModalAuthed: boolean;
  profile: Profile | null;
  profileLoading: boolean;
  getProfileWithDid: (did: string) => Promise<Profile | null>;
  updateProfile: (profile: Profile) => Promise<void>;
}
const defaultContextValue: ProfileStateContextValue = {
  s3ProfileModalInitialed: false,
  s3ProfileModalAuthed: false,
  profile: null,
  profileLoading: false,
  getProfileWithDid: async () => null,
  updateProfile: async () => {},
};
const ProfileStateContext = createContext(defaultContextValue);

const defaultNewProfile: Profile = {
  name: "",
  avatar: "",
  bio: "",
  tags: [],
  wallets: [],
};

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
    s3ProfileModel = new S3ProfileModel(ceramicHost);
    setS3ProfileModalInitialed(true);
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
          if (res?.errors && res.errors.length > 0) {
            setProfile(defaultNewProfile);
          } else {
            setProfile(res.data?.viewer?.profile || null);
          }
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

  const updateProfile = useCallback(
    async (data: Profile) => {
      if (!session || !s3ProfileModalAuthed || !s3ProfileModel) {
        throw Error("updateProfile: not authed");
      }
      const newProfile = { ...profile, ...data };

      const res = await s3ProfileModel.mutationPersonalProfile({
        name: newProfile.name || shortDid(session.id),
        avatar: newProfile.avatar || "",
        bio: newProfile.bio || "bio",
        tags: [...(newProfile.tags || [])],
        wallets: [...(newProfile.wallets || [])],
      });

      if (res?.errors && res.errors.length > 0) {
        throw Error(res.errors[0].message);
      }
      setProfile(newProfile);
    },
    [session, s3ProfileModalAuthed, profile]
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
          updateProfile,
        }),
        [
          s3ProfileModalInitialed,
          s3ProfileModalAuthed,
          profile,
          profileLoading,
          getProfileWithDid,
          updateProfile,
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
