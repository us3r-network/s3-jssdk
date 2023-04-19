import type { Preview } from "@storybook/react";
import React from "react";
import App from "../packages/profile/stories/App";

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
      <App>
        <Story />
      </App>
    ),
  ],
};

export default preview;
