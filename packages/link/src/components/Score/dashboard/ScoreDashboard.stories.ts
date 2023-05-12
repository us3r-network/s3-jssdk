import type { Meta, StoryObj } from "@storybook/react";
import { ScoreDashboard as ScoreDashboardComponent } from "./ScoreDashboard";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";
const meta = {
  title: "Components/ScoreDashboard",
  component: ScoreDashboardComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ScoreDashboardComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreDashboard: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
