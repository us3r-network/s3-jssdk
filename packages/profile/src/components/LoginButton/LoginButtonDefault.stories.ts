import type { Meta, StoryObj } from "@storybook/react";

import { LoginButtonDefault as LoginButtonDefaultComponent } from ".";
const meta = {
  title: "Components/LoginButton/LoginButtonDefault",
  component: LoginButtonDefaultComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButtonDefaultComponent>;
export default meta;

type Story = StoryObj<typeof LoginButtonDefaultComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginButton: Story = {};
