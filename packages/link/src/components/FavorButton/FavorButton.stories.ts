import type { Meta, StoryObj } from "@storybook/react";

import { FavorButton } from "./FavorButton";
import FavorButtonUiComponent from "../../ui/FavorButton/FavorButton";
import FavorButtonUiCode from "!!raw-loader!../../ui/FavorButton/FavorButton";
import { EXAMPLE_LINKID_1 } from "../../../stories/constants";

const meta = {
  title: "Components/FavorButton",
  component: FavorButton,
} satisfies Meta<typeof FavorButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const FavorButtonStory: Story = {
  name: "FavorButton",
  render: FavorButtonUiComponent,
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
