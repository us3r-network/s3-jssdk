import type { Meta, StoryObj } from "@storybook/react";

import { UserNameDefault as UserNameDefaultComponent } from ".";
const meta = {
  title: "Components/UserName/UserNameDefault",
  component: UserNameDefaultComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserNameDefaultComponent>;
export default meta;

type Story = StoryObj<typeof UserNameDefaultComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserName: Story = {};
