import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useUserTagsAddFormState } from "./UserTagsAddFormContext";

export function TagInput(props: InputProps) {
  const { tag, setTag, disabled } = useUserTagsAddFormState();
  return (
    <Input
      data-tag-input=""
      disabled={disabled}
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
  const { disabled, submitCreate } = useUserTagsAddFormState();
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
  const { errMsg } = useUserTagsAddFormState();
  return (
    <span data-error-message="" {...props}>
      {errMsg}
    </span>
  );
}
