import type { Meta, StoryObj } from "@storybook/react";
import { ScoreForm } from "./ScoreForm";
import ScoreFormUiComponent from "../../../ui/Score/form/ScoreForm";
import ScoreFormUiCode from "!!raw-loader!../../../ui/Score/form/ScoreForm";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/ScoreForm",
  component: ScoreForm,
  render: ScoreFormUiComponent,
} satisfies Meta<typeof ScoreForm>;
export default meta;

type Story = StoryObj<typeof meta>;

export const ScoreFormStory: Story = {
  name: "ScoreForm",
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
