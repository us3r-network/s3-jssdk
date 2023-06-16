import type { Meta, StoryObj } from "@storybook/react";
import { ScoreDashboard } from "./ScoreDashboard";
import ScoreDashboardUiComponent from "../../../ui/Score/dashboard/ScoreDashboard";
import ScoreDashboardUiCode from "!!raw-loader!../../../ui/Score/dashboard/ScoreDashboard";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/ScoreDashboard",
  component: ScoreDashboard,
  render: ScoreDashboardUiComponent,
} satisfies Meta<typeof ScoreDashboard>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreDashboardStory: Story = {
  name: "ScoreDashboard",
  parameters: {
    docs: {
      source: {
        code: ScoreDashboardUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
