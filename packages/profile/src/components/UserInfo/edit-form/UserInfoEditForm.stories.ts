import type { Meta, StoryObj } from "@storybook/react";
import { UserInfoEditForm as UserInfoEditFormComponent } from "./UserInfoEditForm";
import {
  DefaultUploadImageResult,
  getAvatarUploadOpts,
} from "../../../../stories/utils/uploadAvatar";
const meta = {
  title: "Components/UserInfoEditForm",
  component: UserInfoEditFormComponent<DefaultUploadImageResult>,
  tags: ["autodocs"],
} satisfies Meta<typeof UserInfoEditFormComponent<DefaultUploadImageResult>>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserInfoEditForm: Story = {
  args: {
    avatarUploadOpts: getAvatarUploadOpts(),
  },
};
