import type { Meta, StoryObj } from "@storybook/react";
import { UserWalletAddForm as UserWalletAddFormComponent } from "./UserWalletAddForm";
const meta = {
  title: "Components/UserWalletAddForm",
  component: UserWalletAddFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserWalletAddFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserWalletAddForm: Story = {};
