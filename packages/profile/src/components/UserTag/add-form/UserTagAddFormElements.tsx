import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useUserTagAddFormState } from "./UserTagAddFormContext";

export function TagInput(props: InputProps) {
  const { tag, setTag, isDisabled } = useUserTagAddFormState();
  return (
    <Input
      data-state-element="TagInput"
      disabled={isDisabled}
      placeholder="tag"
      value={tag}
      onChange={(e) => {
        setTag(e.target.value);
      }}
      {...props}
    />
  );
}

export function SubmitButton(props: ButtonProps) {
  const { isDisabled, submitAdd } = useUserTagAddFormState();
  return (
    <Button
      data-state-element="SubmitButton"
      onPress={submitAdd}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

export function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useUserTagAddFormState();
  return (
    <span data-state-element="ErrorMessage" {...props}>
      {errMsg}
    </span>
  );
}
