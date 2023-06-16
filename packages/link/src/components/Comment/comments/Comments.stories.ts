import type { Meta, StoryObj } from "@storybook/react";
import { Comments } from "./Comments";
import CommentsUiComponent from "../../../ui/Comment/comments/Comments";
import CommentsUiCode from "!!raw-loader!../../../ui/Comment/comments/Comments";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/Comments",
  component: Comments,
  render: CommentsUiComponent,
} satisfies Meta<typeof Comments>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const CommentsStory: Story = {
  name: "Comments",
  parameters: {
    docs: {
      source: {
        code: CommentsUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
