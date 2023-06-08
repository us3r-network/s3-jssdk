import type { Meta, StoryObj } from "@storybook/react";

import VoteButtonUiComponent from "../../ui/VoteButton/VoteButton";
import VoteButtonUiCode from "!!raw-loader!../../ui/VoteButton/VoteButton";
import { EXAMPLE_LINKID_1 } from "../../../stories/constants";

const meta = {
  title: "Components/VoteButton",
  component: VoteButtonUiComponent,
} satisfies Meta<typeof VoteButtonUiComponent>;
export default meta;

type Story = StoryObj<typeof VoteButtonUiComponent>;

export const VoteButton: Story = {
  parameters: {
    docs: {
      source: {
        code: VoteButtonUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
