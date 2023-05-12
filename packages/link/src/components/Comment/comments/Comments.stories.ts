import type { Meta, StoryObj } from "@storybook/react";
import { Comments as CommentsComponent } from "./Comments";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";
const meta = {
  title: "Components/Comments",
  component: CommentsComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof CommentsComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Comments: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
