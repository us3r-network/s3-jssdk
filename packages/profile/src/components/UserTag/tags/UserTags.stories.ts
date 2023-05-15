import type { Meta, StoryObj } from "@storybook/react";
import { UserTags as UserTagsComponent } from "./UserTags";
import { DEFAULT_DID } from "../../../utils/constants";
const meta = {
  title: "Components/UserTags",
  component: UserTagsComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserTagsComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserTags: Story = {};

export const OtherUserTags: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
