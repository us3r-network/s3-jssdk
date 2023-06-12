import type { Meta, StoryObj } from "@storybook/react";
import ScoreFormUiComponent from "../../../ui/Score/form/ScoreForm";
import ScoreFormUiCode from "!!raw-loader!../../../ui/Score/form/ScoreForm";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/ScoreForm",
  component: ScoreFormUiComponent,
} satisfies Meta<typeof ScoreFormUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreForm: Story = {
  parameters: {
    docs: {
      source: {
        code: ScoreFormUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
