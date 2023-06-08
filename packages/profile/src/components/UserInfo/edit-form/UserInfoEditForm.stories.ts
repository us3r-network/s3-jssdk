import type { Meta, StoryObj } from "@storybook/react";
import UserInfoEditFormUiComponent from "../../../ui/UserInfo/edit-form/UserInfoEditForm";
import UserInfoEditFormUiCode from "!!raw-loader!../../../ui/UserInfo/edit-form/UserInfoEditForm";
import {
  DefaultUploadImageResult,
  getAvatarUploadOpts,
} from "../../../../stories/utils/uploadAvatar";

const meta = {
  title: "Components/UserInfoEditForm",
  component: UserInfoEditFormUiComponent<DefaultUploadImageResult>,
} satisfies Meta<typeof UserInfoEditFormUiComponent<DefaultUploadImageResult>>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserInfoEditForm: Story = {
  parameters: {
    docs: {
      source: {
        code: UserInfoEditFormUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    avatarUploadOpts: getAvatarUploadOpts(),
  },
};
