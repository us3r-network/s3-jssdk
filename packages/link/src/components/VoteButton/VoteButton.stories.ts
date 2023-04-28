import type { Meta, StoryObj } from "@storybook/react";

import { VoteButton as VoteButtonComponent } from "./VoteButton";
const meta = {
  title: "Components/VoteButton",
  component: VoteButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof VoteButtonComponent>;
export default meta;

type Story = StoryObj<typeof VoteButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const VoteButton: Story = {
  args: {
    linkId:
      (process.env.REACT_APP_EXAMPLE_POST_LINKID_1 as string) ||
      "kjzl6kcym7w8y8n1yxa1xihla0bi22lr2ewxpzpkaxdtreahmgly8dx40x3v82a",
  },
};
