import React, { useCallback, useEffect } from "react";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { S3ProfileModel } from "@us3r-network/data-model";

import { LoginButton } from "@us3r-network/profile";

export const CERAMIC_TESTNET_HOST = "https://gcp-ceramic-testnet-dev.s3.xyz";

const s3Profile = new S3ProfileModel(CERAMIC_TESTNET_HOST);

function App() {
  const session = useSession();

  const queryPersonal = useCallback(async () => {
    const resp = await s3Profile.queryPersonalProfile();
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.viewer.profile);
  }, []);

  const createProfile = useCallback(async () => {
    if (!session) return;
    s3Profile.authComposeClient(session);
    const resp = await s3Profile.mutationPersonalProfile({
      name: "Luffy",
      bio: "I am Luffy",
    });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.createProfile);
  }, [session]);

  const updateProfile = useCallback(() => {
    if (!session) return;
    s3Profile.authComposeClient(session);
  }, [session]);

  useEffect(() => {
    if (!session) {
      s3Profile.resetComposeClient();
      return;
    }

    s3Profile.authComposeClient(session);
  }, [session]);
  return (
    <div className="App">
      <LoginButton />
      <div>
        <button onClick={queryPersonal}>query Personal</button>
        <button onClick={createProfile}>create Profile</button>
        <button onClick={updateProfile}>updateDapp</button>
      </div>
    </div>
  );
}

export default App;
