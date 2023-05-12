import type { Meta, StoryObj } from "@storybook/react";

import { FavorButton as FavorButtonComponent } from ".";
import { EXAMPLE_LINKID_1 } from "../../../stories/constants";
const meta = {
  title: "Components/FavorButton",
  component: FavorButtonComponent,
} satisfies Meta<typeof FavorButtonComponent>;
export default meta;

type Story = StoryObj<typeof FavorButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FavorButton: Story = {
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
