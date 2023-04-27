import type { Meta, StoryObj } from "@storybook/react";
import { UserAvatar as UserAvatarComponent } from ".";
import { DEFAULT_DID } from "../../utils/constants";
const meta = {
  title: "Components/UserAvatar",
  component: UserAvatarComponent,
} satisfies Meta<typeof UserAvatarComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserAvatar: Story = {};

// export const OtherUserAvatar: Story = {
//   args: {
//     did: DEFAULT_DID,
//   },
// };
