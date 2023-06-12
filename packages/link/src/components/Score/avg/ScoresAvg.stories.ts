import type { Meta, StoryObj } from "@storybook/react";
import { ScoresAvg } from "./ScoresAvg";
import ScoresAvgUiComponent from "../../../ui/Score/avg/ScoresAvg";
import ScoresAvgUiCode from "!!raw-loader!../../../ui/Score/avg/ScoresAvg";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/ScoresAvg",
  component: ScoresAvg,
  render: ScoresAvgUiComponent,
} satisfies Meta<typeof ScoresAvg>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoresAvgStory: Story = {
  name: "ScoresAvg",
  parameters: {
    docs: {
      source: {
        code: ScoresAvgUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
