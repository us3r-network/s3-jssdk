import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar } from "./UserAvatar";
import UserAvatarUiComponent from "../../ui/UserAvatar/UserAvatar";
import UserAvatarUiCode from "!!raw-loader!../../ui/UserAvatar/UserAvatar";
import { DEFAULT_DID } from "../../utils/constants";

const meta = {
  title: "Components/UserAvatar",
  component: UserAvatar,
  render: UserAvatarUiComponent,
} satisfies Meta<typeof UserAvatar>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserAvatarStory: Story = {
  name: "UserAvatar",
  parameters: {
    docs: {
      source: {
        code: UserAvatarUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserAvatarStory: Story = {
  name: "OtherUserAvatar",
  args: {
    did: DEFAULT_DID,
  },
};
