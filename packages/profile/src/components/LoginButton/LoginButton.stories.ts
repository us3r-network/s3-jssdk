import type { Meta, StoryObj } from "@storybook/react";

import LoginButtonUiComponent from "../../ui/LoginButton/LoginButton";
import LoginButtonUiCode from "!!raw-loader!../../ui/LoginButton/LoginButton";

const meta = {
  title: "Components/LoginButton",
  component: LoginButtonUiComponent,
} satisfies Meta<typeof LoginButtonUiComponent>;
export default meta;

type Story = StoryObj<typeof LoginButtonUiComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButton: Story = {
  parameters: {
    docs: {
      source: {
        code: LoginButtonUiCode,
        language: "tsx",
      },
    },
  },
};
