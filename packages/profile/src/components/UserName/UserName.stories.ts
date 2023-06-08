import type { Meta, StoryObj } from "@storybook/react";
import UserNameUiComponent from "../../ui/UserName/UserName";
import UserNameUiCode from "!!raw-loader!../../ui/UserName/UserName";
import { DEFAULT_DID } from "../../utils/constants";

const meta = {
  title: "Components/UserName",
  component: UserNameUiComponent,
} satisfies Meta<typeof UserNameUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserName: Story = {
  parameters: {
    docs: {
      source: {
        code: UserNameUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserName: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
