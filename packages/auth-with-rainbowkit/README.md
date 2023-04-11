# @us3r-network/auth-with-rainbowkit

The @us3r-network/auth-with-rainbowkit package is a react component, that uses `rainbowKit` combined with `@us3r-network/auth` to establish a session

## Install

```
npm install ethers wagmi @us3r-network/auth @us3r-network/auth-with-rainbowkit
```

Where `ethers` `wagmi` is the peerDependencies of rainbowkit

## Usage

```tsx
// Index.tsx
import { Us3rAuthProvider } from "@us3r-network/auth-with-rainbowkit";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Us3rAuthProvider>
      <App />
    </Us3rAuthProvider>
  </React.StrictMode>
);

// App.tsx
import { useUs3rAuth } from "@us3r-network/auth-with-rainbowkit";

function App() {
  const { session, ready, status, signIn, signOut } = useUs3rAuth();
  const isAuthorized = session?.isAuthorized();
  return (
    <div className="App">
      <p>
        {ready ? (
          <button
            onClick={() => {
              if (isAuthorized) {
                signOut();
              } else {
                signIn();
              }
            }}
          >
            {isAuthorized ? "Logout" : "Login"}
          </button>
        ) : (
          "u3srAuth init ..."
        )}
      </p>

      <p>U3srAuth Ready: {String(ready)}</p>
      <p>Authentication Status: {status}</p>
      <p>Session Id: {session?.id}</p>
      <p>Session Str: {session?.serialize()}</p>
    </div>
  );
}

export default App;
```
