# @us3r-network/profile

We created a [data model](https://github.com/us3r-network/s3-jssdk/tree/main/packages/data-model) about user profile based on ceramic, and provided crud SDK for the model, and commonly used react components related to profile

[![License](https://img.shields.io/badge/License-MIT.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40us3r-network%2Fprofile.svg)](https://badge.fury.io/js/%40us3r-network%2Fprofile)
[![npm downloads](https://img.shields.io/npm/dm/%40us3r-network%2Fprofile.svg)](https://www.npmjs.com/package/@us3r-network/profile)

## Install

```bash
npm install @us3r-network/auth-with-rainbowkit @us3r-network/profile
```

Where [@us3r-network/auth-with-rainbowkit](https://github.com/us3r-network/s3-jssdk/tree/main/packages/auth-with-rainbowkit) is the peerDependencies of @us3r-network/profile

## Usage

You need to wrap your application with `Us3rAuthWithRainbowkitProvider` and `ProfileStateProvider` first.

```tsx
import { PropsWithChildren } from "react";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";
import { ProfileStateProvider } from "@us3r-network/profile";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <ProfileStateProvider ceramicHost={process.env.REACT_APP_CERAMIC_HOST}>
        {children}
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
```

Then you can start using our components. For more information, please refer to our component documentation [storybook](https://www.components.s3.xyz/?path=/docs/components-profile-introduction--docs).
