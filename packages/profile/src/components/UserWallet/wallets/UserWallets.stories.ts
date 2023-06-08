import type { Meta, StoryObj } from "@storybook/react";
import UserWalletsUiComponent from "../../../ui/UserWallet/wallets/UserWallets";
import UserWalletsUiCode from "!!raw-loader!../../../ui/UserWallet/wallets/UserWallets";
import { DEFAULT_DID } from "../../../utils/constants";

const meta = {
  title: "Components/UserWallets",
  component: UserWalletsUiComponent,
} satisfies Meta<typeof UserWalletsUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserWallets: Story = {
  parameters: {
    docs: {
      source: {
        code: UserWalletsUiCode,
        language: "tsx",
      },
    },
  },
};

export const OtherUserWallets: Story = {
  args: {
    did: DEFAULT_DID,
  },
};
