import type { Meta, StoryObj } from "@storybook/react";
import { UserTagAddForm as UserTagAddFormComponent } from "./UserTagAddForm";
const meta = {
  title: "Components/UserTagAddForm",
  component: UserTagAddFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserTagAddFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserTagAddForm: Story = {};
