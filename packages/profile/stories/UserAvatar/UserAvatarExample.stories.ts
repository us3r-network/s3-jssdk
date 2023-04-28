import type { Meta, StoryObj } from "@storybook/react";

import { UserAvatarExample as UserAvatarExampleComponent } from "./UserAvatarExample";
import code from "!!raw-loader!./UserAvatarExample";

const meta = {
  title: "Examples/UserAvatarExample",
  component: UserAvatarExampleComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserAvatarExampleComponent>;
export default meta;

type Story = StoryObj<typeof UserAvatarExampleComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserAvatarExample: Story = {
  parameters: {
    docs: {
      source: {
        code,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
