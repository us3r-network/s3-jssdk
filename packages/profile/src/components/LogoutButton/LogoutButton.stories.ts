import type { Meta, StoryObj } from "@storybook/react";
import { LogoutButton as LogoutButtonComponent } from ".";
const meta = {
  title: "Components/LogoutButton",
  component: LogoutButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LogoutButtonComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LogoutButton: Story = {};
