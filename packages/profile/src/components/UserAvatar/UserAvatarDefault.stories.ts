import type { Meta, StoryObj } from "@storybook/react";

import { UserAvatarDefault as UserAvatarDefaultComponent } from ".";
import { DEFAULT_DID } from "../../utils/constants";
const meta = {
  title: "Components/UserAvatar/UserAvatarDefault",
  component: UserAvatarDefaultComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserAvatarDefaultComponent>;
export default meta;

type Story = StoryObj<typeof UserAvatarDefaultComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserAvatar: Story = {};

export const OtherUserAvatar: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
