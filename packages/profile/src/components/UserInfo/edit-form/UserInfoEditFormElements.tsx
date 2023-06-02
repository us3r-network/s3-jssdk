import {
  Button,
  ButtonProps,
  Input,
  InputProps,
  Label,
  TextField,
  TextFieldProps,
} from "react-aria-components";
import { useUserInfoEditFormState } from "./UserInfoEditFormContext";
import { HTMLAttributes, useMemo } from "react";
import { TextArea, TextAreaProps } from "../../common/TextArea";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import LoadingSpokes from "../../common/Loading/LoadingSpokes";

type AvatarFieldRenderProps = {
  isLoading: boolean;
  isUploadingAvatar: boolean;
  avatar: string;
};

export function AvatarField({
  children,
  ...props
}: ChildrenRenderProps<TextFieldProps, AvatarFieldRenderProps>) {
  const { isLoading, isUpdating, isUploadingAvatar, avatar } =
    useUserInfoEditFormState();
  const isDisabled = useMemo(
    () => isLoading || isUpdating || isUploadingAvatar,
    [isLoading, isUpdating, isUploadingAvatar]
  );
  const fieldProps = {
    name: "avatar",
    type: "url",
    isDisabled: isDisabled,
  };
  const renderProps = {
    isLoading,
    isUploadingAvatar,
    avatar,
  };
  const defaultChildren = useMemo(
    () => <AvatarFieldDefaultChildren {...renderProps} />,
    [renderProps]
  );
  return (
    <TextField
      data-state-element="AvatarField"
      aria-label="avatar"
      {...fieldProps}
      {...props}
    >
      {childrenRender(
        children,
        { ...fieldProps, ...renderProps },
        defaultChildren
      )}
    </TextField>
  );
}

function AvatarFieldDefaultChildren({
  isLoading,
  isUploadingAvatar,
}: AvatarFieldRenderProps) {
  return isLoading || isUploadingAvatar ? (
    <LoadingSpokes color="#666" width={32} />
  ) : (
    <>
      <Label>
        <AvatarPreviewImg />
      </Label>
      <AvatarUploadInput />
    </>
  );
}

export function AvatarPreviewImg(props: HTMLAttributes<HTMLImageElement>) {
  const { avatar } = useUserInfoEditFormState();
  return (
    <img
      data-state-element="AvatarPreviewImg"
      src={avatar}
      width={32}
      height={32}
      {...props}
    />
  );
}

export function AvatarUploadInput(props: InputProps) {
  const { setAvatar, isDisabled, avatarUploadOpts, setIsUploadingAvatar } =
    useUserInfoEditFormState();
  if (!avatarUploadOpts) {
    throw new Error("avatarUploadOpts is required");
  }
  const { upload, validate, getUrl } = avatarUploadOpts;
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
        try {
          setIsUploadingAvatar(true);
          const resp = await upload(file);
          if (!validate(resp)) return;
          const url = await getUrl(resp);
          setAvatar(url);
        } catch (error) {
          console.error(error);
        } finally {
          setIsUploadingAvatar(false);
        }
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
