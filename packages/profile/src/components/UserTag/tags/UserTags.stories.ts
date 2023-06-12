import type { Meta, StoryObj } from "@storybook/react";
import { UserTags } from "./UserTags";
import UserTagsUiComponent from "../../../ui/UserTag/tags/UserTags";
import UserTagsUiCode from "!!raw-loader!../../../ui/UserTag/tags/UserTags";
import { DEFAULT_DID } from "../../../utils/constants";

const meta = {
  title: "Components/UserTags",
  component: UserTags,
  render: UserTagsUiComponent,
} satisfies Meta<typeof UserTags>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserTagsStory: Story = {
  name: "UserTags",
  parameters: {
    docs: {
      source: {
        code: UserTagsUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserTagsStory: Story = {
  name: "OtherUserTags",
  args: {
    did: DEFAULT_DID,
  },
};
