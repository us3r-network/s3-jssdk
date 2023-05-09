import type { Meta, StoryObj } from "@storybook/react";
import { Comments as CommentsComponent } from "./Comments";
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
    linkId:
      (process.env.REACT_APP_EXAMPLE_POST_LINKID_1 as string) ||
      "kjzl6kcym7w8y8n1yxa1xihla0bi22lr2ewxpzpkaxdtreahmgly8dx40x3v82a",
  },
};
