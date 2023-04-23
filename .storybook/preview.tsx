import type { Preview } from "@storybook/react";
import React from "react";
import Us3rAuthWithRainbowkitProvider from "../packages/auth-with-rainbowkit/src/Us3rAuthWithRainbowkitProvider";
import ProfileStateProvider from "../packages/profile/src/ProfileStateProvider";
import LinkStateProvider from "../packages/link/src/LinkStateProvider";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <Us3rAuthWithRainbowkitProvider>
        <ProfileStateProvider
          ceramicHost={
            (process.env.REACT_APP_CERAMIC_HOST as string) ||
            "https://ceramic.s3.xyz"
          }
        >
          <LinkStateProvider
            ceramicHost={
              (process.env.REACT_APP_CERAMIC_HOST as string) ||
              "https://ceramic.s3.xyz"
            }
          >
            <Story />
          </LinkStateProvider>
        </ProfileStateProvider>
      </Us3rAuthWithRainbowkitProvider>
    ),
  ],
};

export default preview;
