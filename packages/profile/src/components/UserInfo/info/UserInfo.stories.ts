import type { Meta, StoryObj } from "@storybook/react";
import UserInfoUiComponent from "../../../ui/UserInfo/info/UserInfo";
import UserInfoUiCode from "!!raw-loader!../../../ui/UserInfo/info/UserInfo";
import {
  DefaultUploadImageResult,
  getAvatarUploadOpts,
} from "../../../../stories/utils/uploadAvatar";
import { DEFAULT_DID } from "../../../utils/constants";

const meta = {
  title: "Components/UserInfo",
  component: UserInfoUiComponent<DefaultUploadImageResult>,
} satisfies Meta<typeof UserInfoUiComponent<DefaultUploadImageResult>>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserInfo: Story = {
  parameters: {
    docs: {
      source: {
        code: UserInfoUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    avatarUploadOpts: getAvatarUploadOpts(),
  },
};

export const OtherUserInfo: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
