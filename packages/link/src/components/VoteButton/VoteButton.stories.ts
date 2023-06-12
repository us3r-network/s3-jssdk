import type { Meta, StoryObj } from "@storybook/react";

import { VoteButton } from "./VoteButton";
import VoteButtonUiComponent from "../../ui/VoteButton/VoteButton";
import VoteButtonUiCode from "!!raw-loader!../../ui/VoteButton/VoteButton";
import { EXAMPLE_LINKID_1 } from "../../../stories/constants";

const meta = {
  title: "Components/VoteButton",
  component: VoteButton,
  render: VoteButtonUiComponent,
} satisfies Meta<typeof VoteButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const VoteButtonStory: Story = {
  name: "VoteButton",
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
