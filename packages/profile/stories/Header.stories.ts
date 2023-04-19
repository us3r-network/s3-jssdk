import HeaderExample from "./Header";
import type { Meta, StoryObj } from "@storybook/react";

import code from "!!raw-loader!./Header";

const meta = {
  title: "Examples/Header",
  component: HeaderExample,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof HeaderExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Header: Story = {
  parameters: {
    docs: {
      source: {
        code,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
