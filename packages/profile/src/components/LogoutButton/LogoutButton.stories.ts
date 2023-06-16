import type { Meta, StoryObj } from "@storybook/react";
import { LogoutButton } from "./LogoutButton";
import LogoutButtonUiComponent from "../../ui/LogoutButton/LogoutButton";
import LogoutButtonUiCode from "!!raw-loader!../../ui/LogoutButton/LogoutButton";

const meta = {
  title: "Components/LogoutButton",
  component: LogoutButton,
  render: LogoutButtonUiComponent,
} satisfies Meta<typeof LogoutButton>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LogoutButtonStory: Story = {
  name: "LogoutButton",
  parameters: {
    docs: {
      source: {
        code: LogoutButtonUiCode,
        language: "tsx",
      },
    },
  },
};
