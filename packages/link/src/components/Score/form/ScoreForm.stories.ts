import type { Meta, StoryObj } from "@storybook/react";
import { ScoreForm as ScoreFormComponent } from "./ScoreForm";
import {
  EXAMPLE_LINKID_1,
  EXAMPLE_SCOREID,
} from "../../../../stories/constants";
const meta = {
  title: "Components/ScoreForm",
  component: ScoreFormComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ScoreFormComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreAddForm: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};

export const ScoreEditForm: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
    scoreId: EXAMPLE_SCOREID,
  },
};
