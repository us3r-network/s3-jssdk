import type { Meta, StoryObj } from "@storybook/react";
import { UserTagsAddForm as UserTagsAddFormComponent } from "./UserTagsAddForm";
const meta = {
  title: "Components/UserTagsAddForm",
  component: UserTagsAddFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserTagsAddFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserTagsAddForm: Story = {};
