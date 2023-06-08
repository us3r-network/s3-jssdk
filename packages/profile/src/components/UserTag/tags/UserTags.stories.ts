import type { Meta, StoryObj } from "@storybook/react";
import UserTagsUiComponent from "../../../ui/UserTag/tags/UserTags";
import UserTagsUiCode from "!!raw-loader!../../../ui/UserTag/tags/UserTags";
import { DEFAULT_DID } from "../../../utils/constants";

const meta = {
  title: "Components/UserTags",
  component: UserTagsUiComponent,
} satisfies Meta<typeof UserTagsUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserTags: Story = {
  parameters: {
    docs: {
      source: {
        code: UserTagsUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserTags: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
