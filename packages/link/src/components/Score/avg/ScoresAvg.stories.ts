import type { Meta, StoryObj } from "@storybook/react";
import { ScoresAvg as ScoresAvgComponent } from "./ScoresAvg";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";
const meta = {
  title: "Components/ScoresAvg",
  component: ScoresAvgComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ScoresAvgComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoresAvg: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
