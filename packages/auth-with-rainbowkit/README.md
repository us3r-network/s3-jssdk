# @us3r-network/auth-with-rainbowkit

The @us3r-network/auth-with-rainbowkit package is a react component, that uses [rainbowKit](https://www.rainbowkit.com/) combined with [@us3r-network/auth](https://github.com/us3r-network/s3-jssdk/tree/main/packages/auth) to establish a session

## Install

```
npm install @us3r-network/auth-with-rainbowkit
```

## Usage

### Wrap providers

Wrap your application with `Us3rAuthWithRainbowkitProvider`.

```tsx
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";

const App = () => {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <YourApp />
    </Us3rAuthWithRainbowkitProvider>
  );
};
```

### Hooks

#### useUs3rAuth

```ts
// Return Value

{
  // did-session
  session: DIDSession;
  // authorization status
  status: "loading" | "unauthenticated" | "authenticated";
  // session ready
  ready: boolean;
  // sign in action
  signIn: () => Promise<void>;
  // sign out action
  signOut: () => void;
}
```

#### useSession

```ts
// Return Value

DIDSession | undefined;
```

## Typical usage pattern

SignButton.tsx

```tsx
import { useUs3rAuth, useSession } from "@us3r-network/auth-with-rainbowkit";

function SignButton() {
  const { ready, status, signIn, signOut } = useUs3rAuth();
  const session = useSession();

  const clickAction = useCallback(() => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  }, [session, signIn, signOut]);

  return (
    <button disabled={!ready} onClick={clickAction}>
      {(() => {
        if (!ready) {
          return "Initializing session...";
        }
        return session ? "SignOut" : "SignIn";
      })()}
    </button>
  );
}
```

ProfilePage.tsx

```tsx
import { useUs3rAuth, useSession } from "@us3r-network/auth-with-rainbowkit";
import SignButton from "your-path/SignButton";

function ProfilePage() {
  const { ready } = useUs3rAuth();
  const session = useSession();
  return (
    <div>
      <div>
        {(() => {
          if (!ready) {
            return "Initializing session...";
          }
          if (sesssion) {
            return (
              <>
                <p>UserName: ...</p>
                <p>UserBio: ...</p>
                <p>OtherInfo: ...</p>
              </>
            );
          }
          return "Please click the button to authorize login";
        })()}
      </div>
      <SignButton />
    </div>
  );
}

export default App;
```
