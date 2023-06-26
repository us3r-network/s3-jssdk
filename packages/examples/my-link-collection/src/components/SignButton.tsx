import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useCallback } from "react";
import {Button} from 'react-aria-components'

export default function SignButton() {
  const { ready, signIn, signOut } = useAuthentication();
  const session = useSession();

  const clickAction = useCallback(() => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  }, [session, signIn, signOut]);

  return (
    // <button disabled={!ready} onPress={clickAction}>
    //   {(() => {
    //     if (!ready) {
    //       return "Initializing session...";
    //     }
    //     return session ? "SignOut" : "SignIn";
    //   })()}
    // </button>


    <Button isDisabled={!ready} onPress={clickAction}>
      {(() => {
        if (!ready) {
          return "Initializing session...";
        }
        return session ? "SignOut" : "SignIn";
      })()}
    </Button>
  );
}
