import type { Meta, StoryObj } from "@storybook/react";
import UserTagAddFormUiComponent from "../../../ui/UserTag/add-form/UserTagAddForm";
import UserTagAddFormUiCode from "!!raw-loader!../../../ui/UserTag/add-form/UserTagAddForm";

const meta = {
  title: "Components/UserTagAddForm",
  component: UserTagAddFormUiComponent,
} satisfies Meta<typeof UserTagAddFormUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserTagAddForm: Story = {
  parameters: {
    docs: {
      source: {
        code: UserTagAddFormUiCode,
        language: "tsx",
      },
    },
  },
};
