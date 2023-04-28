import type { Meta, StoryObj } from "@storybook/react";

import { LoginButton as LoginButtonComponent } from ".";
const meta = {
  title: "Components/LoginButton",
  component: LoginButtonComponent,
} satisfies Meta<typeof LoginButtonComponent>;
export default meta;

type Story = StoryObj<typeof LoginButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButton: Story = {};
