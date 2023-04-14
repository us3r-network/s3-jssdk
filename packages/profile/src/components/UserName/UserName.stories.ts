import type { Meta, StoryObj } from "@storybook/react";
import UserName from "./UserName";
const meta = {
  title: "Components/UserName",
  component: UserName,
  tags: ["autodocs"],
} satisfies Meta<typeof UserName>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserName: Story = {};

export const OtherUserName: Story = {
  args: {
    did: "did:pkh:0",
  },
};

export const CustomUserName: Story = {
  args: {
    name: "Nicole",
  },
};
