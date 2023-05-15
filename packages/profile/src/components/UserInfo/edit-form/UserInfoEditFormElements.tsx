import { Button, ButtonProps, Input, InputProps } from "react-aria-components";
import { uploadImage } from "../../../utils/uploadFile";
import { useUserInfoEditFormState } from "./UserInfoEditFormContext";
import { HTMLAttributes } from "react";
import { TextArea, TextAreaProps } from "../../common/TextArea";

export function AvatarPreview(props: HTMLAttributes<HTMLImageElement>) {
  const { avatar } = useUserInfoEditFormState();
  return (
    <img
      data-state-element="AvatarPreview"
      src={avatar}
      width={32}
      height={32}
      {...props}
    />
  );
}

export function AvatarUploadInput(props: InputProps) {
  const { setAvatar, isDisabled } = useUserInfoEditFormState();
  return (
    <Input
      data-state-element="AvatarUploadInput"
      disabled={isDisabled}
      placeholder="avatar"
      type="file"
      onChange={async (e) => {
        const target = e.target as HTMLInputElement;
        const file = target.files && target.files[0];
        if (!file) return;
        const resp = await uploadImage(file);
        const body = await resp.json();
        setAvatar(body.url);
      }}
      {...props}
    />
  );
}

export function NameInput(props: InputProps) {
  const { name, setName, isDisabled } = useUserInfoEditFormState();
  return (
    <Input
      data-state-element="NameInput"
      disabled={isDisabled}
      placeholder="name"
      value={name}
      onChange={(e) => {
        setName(e.target.value);
      }}
      {...props}
    />
  );
}

export function BioTextArea(props: TextAreaProps) {
  const { bio, setBio, isDisabled } = useUserInfoEditFormState();
  return (
    <TextArea
      data-state-element="BioTextArea"
      disabled={isDisabled}
      placeholder="bio"
      value={bio}
      onChange={(e) => {
        setBio(e.target.value);
      }}
      {...props}
    />
  );
}

export function SubmitButton(props: ButtonProps) {
  const { isDisabled, submitEdit } = useUserInfoEditFormState();
  return (
    <Button
      data-state-element="SubmitButton"
      onPress={submitEdit}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

export function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useUserInfoEditFormState();
  return (
    <span data-state-element="AvatarPreview" {...props}>
      {errMsg}
    </span>
  );
}
