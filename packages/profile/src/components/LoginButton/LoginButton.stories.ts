import type { Meta, StoryObj } from "@storybook/react";

import { LoginButton } from "./LoginButton";
import LoginButtonUiComponent from "../../ui/LoginButton/LoginButton";
import LoginButtonUiCode from "!!raw-loader!../../ui/LoginButton/LoginButton";

const meta = {
  title: "Components/LoginButton",
  component: LoginButton,
  render: LoginButtonUiComponent,
} satisfies Meta<typeof LoginButton>;
export default meta;

type Story = StoryObj<typeof meta>;

export const LoginButtonStory: Story = {
  name: "LoginButton",
  parameters: {
    docs: {
      source: {
        code: LoginButtonUiCode,
        language: "tsx",
      },
    },
  },
};
