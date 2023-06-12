import type { Meta, StoryObj } from "@storybook/react";
import ScoreReviewsUiComponent from "../../../ui/Score/reviews/ScoreReviews";
import ScoreReviewsUiCode from "!!raw-loader!../../../ui/Score/reviews/ScoreReviews";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";

const meta = {
  title: "Components/ScoreReviews",
  component: ScoreReviewsUiComponent,
} satisfies Meta<typeof ScoreReviewsUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreReviews: Story = {
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
