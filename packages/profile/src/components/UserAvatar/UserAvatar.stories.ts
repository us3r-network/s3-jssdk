import type { Meta, StoryObj } from "@storybook/react";
import UserAvatarUiComponent from "../../ui/UserAvatar/UserAvatar";
import UserAvatarUiCode from "!!raw-loader!../../ui/UserAvatar/UserAvatar";
import { DEFAULT_DID } from "../../utils/constants";

const meta = {
  title: "Components/UserAvatar",
  component: UserAvatarUiComponent,
} satisfies Meta<typeof UserAvatarUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserAvatar: Story = {
  parameters: {
    docs: {
      source: {
        code: UserAvatarUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserAvatar: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
