import type { Meta, StoryObj } from "@storybook/react";
import { UserName as UserNameComponent } from ".";
import { DEFAULT_DID } from "../../utils/constants";
const meta = {
  title: "Components/UserName",
  component: UserNameComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserNameComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserName: Story = {};

export const OtherUserName: Story = {
  args: {
    did: DEFAULT_DID,
  },
};

export const CustomUserName: Story = {
  args: {
    name: "Nicole",
  },
};
