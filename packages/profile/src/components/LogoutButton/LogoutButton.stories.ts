import type { Meta, StoryObj } from "@storybook/react";
import LogoutButtonUiComponent from "../../ui/LogoutButton/LogoutButton";
import LogoutButtonUiCode from "!!raw-loader!../../ui/LogoutButton/LogoutButton";

const meta = {
  title: "Components/LogoutButton",
  component: LogoutButtonUiComponent,
} satisfies Meta<typeof LogoutButtonUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LogoutButton: Story = {
  parameters: {
    docs: {
      source: {
        code: LogoutButtonUiCode,
        language: "tsx",
      },
    },
  },
};
