import type { Meta, StoryObj } from "@storybook/react";
import { UserInfo as UserInfoComponent } from "./UserInfo";
import { DEFAULT_DID } from "../../../utils/constants";
const meta = {
  title: "Components/UserInfo",
  component: UserInfoComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserInfoComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserInfo: Story = {};

export const OtherUserInfo: Story = {
  args: {
    did: DEFAULT_DID,
  },
};