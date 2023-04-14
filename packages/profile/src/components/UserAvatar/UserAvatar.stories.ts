import type { Meta, StoryObj } from "@storybook/react";
import UserAvatar from "./UserAvatar";
const meta = {
  title: "Components/UserAvatar",
  component: UserAvatar,
  tags: ["autodocs"],
} satisfies Meta<typeof UserAvatar>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserAvatar: Story = {};

export const OtherUserAvatar: Story = {
  args: {
    did: "did:pkh:0",
  },
};
