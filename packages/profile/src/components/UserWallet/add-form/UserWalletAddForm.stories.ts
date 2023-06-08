import type { Meta, StoryObj } from "@storybook/react";
import UserWalletAddFormUiComponent from "../../../ui/UserWallet/add-form/UserWalletAddForm";
import UserWalletAddFormUiCode from "!!raw-loader!../../../ui/UserWallet/add-form/UserWalletAddForm";

const meta = {
  title: "Components/UserWalletAddForm",
  component: UserWalletAddFormUiComponent,
} satisfies Meta<typeof UserWalletAddFormUiComponent>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserWalletAddForm: Story = {
  parameters: {
    docs: {
      source: {
        code: UserWalletAddFormUiCode,
        language: "tsx",
      },
    },
  },
};
