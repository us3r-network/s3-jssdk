import type { Meta, StoryObj } from "@storybook/react";
import { UserName } from "./UserName";
import UserNameUiComponent from "../../ui/UserName/UserName";
import UserNameUiCode from "!!raw-loader!../../ui/UserName/UserName";
import { DEFAULT_DID } from "../../utils/constants";

const meta = {
  title: "Components/UserName",
  component: UserName,
  render: UserNameUiComponent,
} satisfies Meta<typeof UserName>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserNameStory: Story = {
  name: "UserName",
  parameters: {
    docs: {
      source: {
        code: UserNameUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserNameStory: Story = {
  name: "OtherUserName",
  args: {
    did: DEFAULT_DID,
  },
};
