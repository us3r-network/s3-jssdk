import type { Preview } from "@storybook/react";
import ProfileStateProvider from "../src/ProfileStateProvider";
import React from "react";

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
    (Story) =>
      React.createElement(
        ProfileStateProvider,
        {
          ceramicHost: process.env.STORYBOOK_CERAMIC_HOST as string,
          themeConfig: {
            mode: "dark",
          },
        },
        React.createElement(Story, null)
      ),
  ],
};

export default preview;
