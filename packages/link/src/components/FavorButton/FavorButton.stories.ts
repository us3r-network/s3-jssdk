import type { Meta, StoryObj } from "@storybook/react";

import FavorButtonComponent from "./FavorButton";
const meta = {
  title: "Components/FavorButton",
  component: FavorButtonComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof FavorButtonComponent>;
export default meta;

type Story = StoryObj<typeof FavorButtonComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const FavorButton: Story = {};
