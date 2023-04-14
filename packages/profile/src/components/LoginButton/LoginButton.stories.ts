import type { Meta, StoryObj } from "@storybook/react";
import LoginButton from "./LoginButton";
const meta = {
  title: "Components/LoginButton",
  component: LoginButton,
  tags: ["autodocs"],
} satisfies Meta<typeof LoginButton>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {};
