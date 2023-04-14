import type { Meta, StoryObj } from "@storybook/react";
import LogoutButton from "./LogoutButton";
const meta = {
  title: "Components/LogoutButton",
  component: LogoutButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LogoutButton>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {};
