import type { Meta, StoryObj } from "@storybook/react";
import { ScoreReviews as ScoreReviewsComponent } from "./ScoreReviews";
import { EXAMPLE_LINKID_1 } from "../../../../stories/constants";
const meta = {
  title: "Components/ScoreReviews",
  component: ScoreReviewsComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof ScoreReviewsComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const ScoreReviews: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
