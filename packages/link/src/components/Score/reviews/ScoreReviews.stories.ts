import type { Meta, StoryObj } from "@storybook/react";
import { ScoreReviews } from "./ScoreReviews";
import ScoreReviewsUiComponent from "../../../ui/Score/reviews/ScoreReviews";
import ScoreReviewsUiCode from "!!raw-loader!../../../ui/Score/reviews/ScoreReviews";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/ScoreReviews",
  component: ScoreReviews,
} satisfies Meta<typeof ScoreReviews>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreReviewsStory: Story = {
  name: "ScoreReviews",
  render: ScoreReviewsUiComponent,
  parameters: {
    docs: {
      source: {
        code: ScoreReviewsUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
