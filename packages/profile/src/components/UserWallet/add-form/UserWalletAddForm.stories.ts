import type { Meta, StoryObj } from "@storybook/react";
import { UserWalletAddForm } from "./UserWalletAddForm";
import UserWalletAddFormUiComponent from "../../../ui/UserWallet/add-form/UserWalletAddForm";
import UserWalletAddFormUiCode from "!!raw-loader!../../../ui/UserWallet/add-form/UserWalletAddForm";

const meta = {
  title: "Components/UserWalletAddForm",
  component: UserWalletAddForm,
  render: UserWalletAddFormUiComponent,
} satisfies Meta<typeof UserWalletAddForm>;
export default meta;

type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const UserWalletAddFormStory: Story = {
  name: "ScoreForm",
  parameters: {
    docs: {
      source: {
        code: UserWalletAddFormUiCode,
        language: "tsx",
      },
    },
  },
};
