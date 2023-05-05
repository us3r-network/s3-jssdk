import type { Meta, StoryObj } from "@storybook/react";
import { UserWalletsAddForm as UserWalletsAddFormComponent } from "./UserWalletsAddForm";
const meta = {
  title: "Components/UserWalletsAddForm",
  component: UserWalletsAddFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserWalletsAddFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserWalletsAddForm: Story = {};
