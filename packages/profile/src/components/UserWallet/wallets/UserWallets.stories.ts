import type { Meta, StoryObj } from "@storybook/react";
import { UserWallets } from "./UserWallets";
import UserWalletsUiComponent from "../../../ui/UserWallet/wallets/UserWallets";
import UserWalletsUiCode from "!!raw-loader!../../../ui/UserWallet/wallets/UserWallets";
import { DEFAULT_DID } from "../../../utils/constants";

const meta = {
  title: "Components/UserWallets",
  component: UserWallets,
  render: UserWalletsUiComponent,
} satisfies Meta<typeof UserWallets>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserWalletsStory: Story = {
  name: "UserWallets",
  parameters: {
    docs: {
      source: {
        code: UserWalletsUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserWalletsStory: Story = {
  name: "OtherUserWallets",
  args: {
    did: DEFAULT_DID,
  },
};
