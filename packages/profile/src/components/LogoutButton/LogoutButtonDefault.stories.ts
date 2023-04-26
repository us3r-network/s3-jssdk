import type { Meta, StoryObj } from "@storybook/react";

import { LogoutButtonDefault as LogoutButtonDefaultComponent } from ".";
const meta = {
  title: "Components/LogoutButton/LogoutButtonDefault",
  component: LogoutButtonDefaultComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LogoutButtonDefaultComponent>;
export default meta;

type Story = StoryObj<typeof LogoutButtonDefaultComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LogoutButton: Story = {};
