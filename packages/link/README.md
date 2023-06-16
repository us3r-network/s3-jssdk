# @us3r-network/link

We created a [data model](https://github.com/us3r-network/s3-jssdk/tree/main/packages/data-model) about user link based on ceramic, and provided crud SDK for the model, and commonly used react components related to link

[![License](https://img.shields.io/badge/License-MIT.svg)](https://opensource.org/licenses/MIT)
[![npm version](https://badge.fury.io/js/%40us3r-network%2Flink.svg)](https://badge.fury.io/js/%40us3r-network%2Flink)
[![npm downloads](https://img.shields.io/npm/dm/%40us3r-network%2Flink.svg)](https://www.npmjs.com/package/@us3r-network/link)

## Install

```bash
npm install @us3r-network/auth-with-rainbowkit @us3r-network/profile @us3r-network/link
```

[@us3r-network/auth-with-rainbowkit](https://github.com/us3r-network/s3-jssdk/tree/main/packages/auth-with-rainbowkit) and [@us3r-network/profile](https://github.com/us3r-network/s3-jssdk/tree/main/packages/profile) are peerDependencies of @us3r-network/link.

## Usage

You need to wrap your application with `Us3rAuthWithRainbowkitProvider`,`ProfileStateProvider` and `LinkStateProvider` first.

```tsx
import { PropsWithChildren } from "react";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";
import { ProfileStateProvider } from "@us3r-network/profile";
import { LinkStateProvider } from "@us3r-network/link";
import { CERAMIC_HOST } from "./constants";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
        <LinkStateProvider ceramicHost={CERAMIC_HOST}>
          {children}
        </LinkStateProvider>
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
```

Then you can start using our components. For more information, please refer to our component documentation [storybook](https://www.components.s3.xyz/?path=/docs/components-link-introduction--docs).
