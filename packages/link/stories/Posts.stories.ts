import PostsExample from "./Posts";
import type { Meta, StoryObj } from "@storybook/react";

import code from "!!raw-loader!./Posts";

const meta = {
  title: "Examples/Posts",
  component: PostsExample,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof PostsExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Posts: Story = {
  parameters: {
    docs: {
      source: {
        code,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
