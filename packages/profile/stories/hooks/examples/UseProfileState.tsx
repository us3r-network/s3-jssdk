import { Profile } from "@us3r-network/data-model";
import { useProfileState, getS3ProfileModel } from "@us3r-network/profile";
import { useEffect, useState } from "react";

export function LoginUserProfileInfo() {
  const { profile, profileLoading, updateProfile } = useProfileState();
  return (
    <div>
      {profileLoading ? (
        <div>loading...</div>
      ) : (
        <>
          <ProfileInfo profile={profile} />
          <button
            onClick={() => {
              updateProfile({
                name: "new name",
                bio: "new bio",
                // ...
              })
                .then(() => {
                  console.log("update profile successfully");
                })
                .catch((err) => {
                  console.log("update profile failed", err);
                });
            }}
          >
            update profile info
          </button>
        </>
      )}
    </div>
  );
}

export function OtherUserProfileInfo({ userId }: { userId: string }) {
  const { getProfileWithDid } = useProfileState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setProfileLoading(true);
      try {
        const profile = await getProfileWithDid(userId);
        setProfile(profile);
      } catch (err) {
        console.log(err);
      } finally {
        setProfileLoading(false);
      }
    })();
  }, [userId]);

  return (
    <div>
      {profileLoading ? (
        <div>loading...</div>
      ) : (
        <ProfileInfo profile={profile} />
      )}
    </div>
  );
}

function ProfileInfo({ profile }: { profile?: Profile | null }) {
  return (
    <div>
      <p>name: {profile?.name}</p>
      <p>avatar: {profile?.avatar}</p>
      <p>bio: {profile?.bio}</p>
      <p>tags: {JSON.stringify(profile?.tags)}</p>
      <p>wallets: {JSON.stringify(profile?.wallets)}</p>
    </div>
  );
}

function useCustomProfileQuery() {
  const { s3ProfileModalInitialed, s3ProfileModalAuthed } = useProfileState();
  const s3ProfileModel = getS3ProfileModel();
  const queryProfileWithDid = async (linkId: string) => {
    if (!s3ProfileModalInitialed) {
      throw Error("s3ProfileModel is not initialed");
    }
    return await s3ProfileModel?.queryProfileWithDid(linkId);
  };

  const queryPersonalProfile = async () => {
    if (!s3ProfileModalAuthed) {
      throw Error("s3ProfileModel is not authed");
    }
    return await s3ProfileModel?.queryPersonalProfile();
  };
  return { queryProfileWithDid, queryPersonalProfile };
}
