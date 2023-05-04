import {
  Button,
  ButtonProps,
  Input,
  InputProps,
  Label,
  LabelProps,
  TextField,
  TextFieldProps,
} from "react-aria-components";
import { uploadImage } from "../../../utils/updateFile";
import { useUserInfoEditFormState } from ".";
import { HTMLAttributes } from "react";

export function FormField(props: TextFieldProps) {
  return <TextField {...props} />;
}
export function FormLabel(props: LabelProps) {
  return <Label {...props} />;
}

export function AvatarPreview(props: HTMLAttributes<HTMLImageElement>) {
  const { avatar } = useUserInfoEditFormState();
  return <img src={avatar} alt="" width={32} height={32} {...props} />;
}

export function AvatarUploadInput(props: InputProps) {
  const { setAvatar, disabled } = useUserInfoEditFormState();
  return (
    <Input
      disabled={disabled}
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
  const { name, setName, disabled } = useUserInfoEditFormState();
  return (
    <Input
      disabled={disabled}
      placeholder="name"
      value={name}
      onChange={(e) => {
        setName(e.target.value);
      }}
      {...props}
    />
  );
}

export function BioInput(props: InputProps) {
  const { bio, setBio, disabled } = useUserInfoEditFormState();
  return (
    <Input
      disabled={disabled}
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
  const { disabled, submitEdit } = useUserInfoEditFormState();
  return <Button onPress={submitEdit} isDisabled={disabled} {...props} />;
}

export function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useUserInfoEditFormState();
  return (
    <span data-error-message="" {...props}>
      {errMsg}
    </span>
  );
}
