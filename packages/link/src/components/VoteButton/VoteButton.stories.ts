import type { Meta, StoryObj } from "@storybook/react";

import { VoteButton as VoteButtonComponent } from "./VoteButton";
import { EXAMPLE_LINKID_1 } from "../../../stories/constants";
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
    linkId: EXAMPLE_LINKID_1,
  },
};
