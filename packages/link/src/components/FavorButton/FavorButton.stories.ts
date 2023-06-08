import type { Meta, StoryObj } from "@storybook/react";

import FavorButtonUiComponent from "../../ui/FavorButton/FavorButton";
import FavorButtonUiCode from "!!raw-loader!../../ui/FavorButton/FavorButton";
import { EXAMPLE_LINKID_1 } from "../../../stories/constants";

const meta = {
  title: "Components/FavorButton",
  component: FavorButtonUiComponent,
} satisfies Meta<typeof FavorButtonUiComponent>;
export default meta;

type Story = StoryObj<typeof FavorButtonUiComponent>;

export const FavorButton: Story = {
  parameters: {
    docs: {
      source: {
        code: FavorButtonUiCode,
        language: "tsx",
      },
    },
  },
  args: {
    linkId: EXAMPLE_LINKID_1,
  },
};
