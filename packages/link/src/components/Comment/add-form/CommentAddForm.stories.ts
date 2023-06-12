import type { Meta, StoryObj } from "@storybook/react";
import CommentAddFormUiComponent from "../../../ui/Comment/add-form/CommentAddForm";
import CommentAddFormUiCode from "!!raw-loader!../../../ui/Comment/add-form/CommentAddForm";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/CommentAddForm",
  component: CommentAddFormUiComponent,
} satisfies Meta<typeof CommentAddFormUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const CommentAddForm: Story = {
  parameters: {
    docs: {
      source: {
        code: CommentAddFormUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
