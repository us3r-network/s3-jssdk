import type { Meta, StoryObj } from "@storybook/react";

import { LogoutButtonExample as LogoutButtonExampleComponent } from "./LogoutButtonExample";
import code from "!!raw-loader!./LogoutButtonExample";

const meta = {
  title: "Examples/LogoutButtonExample",
  component: LogoutButtonExampleComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof LogoutButtonExampleComponent>;
export default meta;

type Story = StoryObj<typeof LogoutButtonExampleComponent>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LogoutButtonExample: Story = {
  parameters: {
    docs: {
      source: {
        code,
      },
      canvas: { sourceState: "shown" },
    },
  },
};
