import type { Meta, StoryObj } from "@storybook/react";
import { CommentAddForm as CommentAddFormComponent } from "./CommentAddForm";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";
const meta = {
  title: "Components/CommentAddForm",
  component: CommentAddFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CommentAddFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const CommentAddForm: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};