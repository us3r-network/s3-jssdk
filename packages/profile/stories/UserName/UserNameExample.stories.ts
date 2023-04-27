import type { Meta, StoryObj } from "@storybook/react";

import { UserNameExample as UserNameExampleComponent } from "./UserNameExample";
import code from "!!raw-loader!./UserNameExample";

const meta = {
  title: "Examples/UserNameExample",
  component: UserNameExampleComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserNameExampleComponent>;
export default meta;

type Story = StoryObj<typeof UserNameExampleComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserNameExample: Story = {
  parameters: {
    docs: {
      source: {
        code,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
