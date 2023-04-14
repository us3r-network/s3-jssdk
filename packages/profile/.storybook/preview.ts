import type { Preview } from "@storybook/react";
import ProfileProvider from "../src/components/ProfileProvider/ProfileProvider";
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
        ProfileProvider,
        {
          ceramicHost: "http://13.215.254.225:7007",
          themeConfig: {
            mode: "dark",
          },
        },
        React.createElement(Story, null)
      ),
  ],
};

export default preview;
