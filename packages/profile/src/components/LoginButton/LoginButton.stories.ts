import type { Meta, StoryObj } from "@storybook/react";
import { userEvent, within } from "@storybook/testing-library";

import LoginButtonComponent from "./LoginButton";
const meta = {
  title: "Components/LoginButton",
  component: LoginButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButtonComponent>;
export default meta;

type Story = StoryObj<typeof LoginButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButton: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // See https://storybook.js.org/docs/react/essentials/actions#automatically-matching-args to learn how to setup logging in the Actions panel
    await userEvent.click(canvas.getByRole("button"));
  },
};
