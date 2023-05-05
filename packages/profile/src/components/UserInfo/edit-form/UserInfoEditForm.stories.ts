import type { Meta, StoryObj } from "@storybook/react";
import { UserInfoEditForm as UserInfoEditFormComponent } from "./UserInfoEditForm";
const meta = {
  title: "Components/UserInfoEditForm",
  component: UserInfoEditFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserInfoEditFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserInfoEditForm: Story = {};
