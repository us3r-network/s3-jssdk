import type { Meta, StoryObj } from "@storybook/react";
import { UserWallets as UserWalletsComponent } from "./UserWallets";
import { DEFAULT_DID } from "../../../utils/constants";
const meta = {
  title: "Components/UserWallets",
  component: UserWalletsComponent,
  tags: ["autodocs"],
} satisfies Meta<typeof UserWalletsComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const LoginUserWallets: Story = {};

export const OtherUserWallets: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
