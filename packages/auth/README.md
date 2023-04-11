# @us3r-network/auth

The @us3r-network/auth package is the basis of us3r-network, it has a `auth` method to establish a session with Ceramic.

## Install

```
npm install @us3r-network/auth
```

## Usage

```tsx
import { BlockChain, Us3rAuth } from "@us3r-network/auth";

const us3rAuth = new Us3rAuth();

const connectUs3r = useCallback(async (chain?: BlockChain) => {
  await us3rAuth.auth(chain);
  setSession(us3rAuth.session);
}, []);
```
