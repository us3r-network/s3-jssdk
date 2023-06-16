import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useUserWalletAddFormState } from "./UserWalletAddFormContext";

function AddressInput(props: InputProps) {
  const { address, setAddress, isDisabled } = useUserWalletAddFormState();
  return (
    <Input
      data-state-element="AddressInput"
      disabled={isDisabled}
      placeholder="address"
      value={address}
      onChange={(e) => {
        setAddress(e.target.value);
      }}
      {...props}
    />
  );
}

function SubmitButton(props: ButtonProps) {
  const { isDisabled, submitAdd } = useUserWalletAddFormState();
  return (
    <Button
      data-state-element="SubmitButton"
      onPress={submitAdd}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useUserWalletAddFormState();
  return (
    <span data-state-element="ErrorMessage" {...props}>
      {errMsg}
    </span>
  );
}

export default {
  AddressInput,
  SubmitButton,
  ErrorMessage,
};
