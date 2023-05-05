import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useUserWalletsAddFormState } from "./UserWalletsAddFormContext";

export function AddressInput(props: InputProps) {
  const { address, setAddress, disabled } = useUserWalletsAddFormState();
  return (
    <Input
      data-address-input=""
      disabled={disabled}
      placeholder="address"
      value={address}
      onChange={(e) => {
        setAddress(e.target.value);
      }}
      {...props}
    />
  );
}

export function SubmitButton(props: ButtonProps) {
  const { disabled, submitCreate } = useUserWalletsAddFormState();
  return (
    <Button
      data-submit-button=""
      onPress={submitCreate}
      isDisabled={disabled}
      {...props}
    />
  );
}

export function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useUserWalletsAddFormState();
  return (
    <span data-error-message="" {...props}>
      {errMsg}
    </span>
  );
}
