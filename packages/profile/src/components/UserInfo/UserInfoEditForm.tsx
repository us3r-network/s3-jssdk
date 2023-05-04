import {
  HTMLAttributes,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useProfileState } from "../../ProfileStateProvider";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { UserInfoEditFormChildren } from "./default-ui/UserInfoEditFormChildren";
import {
  UserInfoEditFormContext,
  UserInfoEditFormContextValue,
  UserInfoEditModalContext,
  useUserInfoState,
} from "./contexts";
import * as UserInfoEditFormElements from "./elements/UserInfoEditForm";

export interface UserInfoEditFormIncomingProps {
  onCancelEdit?: () => void;
}

export interface UserInfoEditFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      UserInfoEditFormContextValue
    >,
    UserInfoEditFormIncomingProps {}

function UserInfoEditForm({
  children,
  onCancelEdit,
  ...props
}: UserInfoEditFormProps) {
  const { isLoginUser, info } = useUserInfoState();
  const { updateProfile } = useProfileState();

  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  const [updating, setUpdating] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const disabled = useMemo(
    () => !isLoginUser || updating,
    [isLoginUser, updating]
  );

  useEffect(() => {
    setAvatar(info?.avatar || "");
    setName(info?.name || "");
    setBio(info?.bio || "");
  }, [info?.avatar, info?.name, info?.bio]);

  useEffect(() => {
    setErrMsg("");
  }, [avatar, name, bio]);

  let editModalContext = useContext(UserInfoEditModalContext);
  const cancelEdit = useCallback(() => {
    if (onCancelEdit) {
      onCancelEdit();
    } else if (editModalContext?.setIsOpen) {
      editModalContext.setIsOpen(false);
    } else {
      throw new Error(
        "UserInfoEditForm: onCancelEdit or UserInfoEditModalContext is required"
      );
    }
  }, [onCancelEdit, editModalContext?.setIsOpen]);

  const submitEdit = useCallback(async () => {
    try {
      setUpdating(true);
      await updateProfile({
        avatar: avatar,
        name: name,
        bio: bio,
      });
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      setUpdating(false);
    }
  }, [avatar, bio, name, updateProfile]);

  const businessProps = {
    "data-us3r-userinfo-edit-form": "",
    "data-updating": updating || undefined,
    "data-disabled": disabled || undefined,
  };
  const contextValue = {
    avatar,
    setAvatar,
    name,
    setName,
    bio,
    setBio,
    updating,
    errMsg,
    disabled,
    submitEdit,
    cancelEdit,
  };
  return (
    <UserInfoEditFormContext.Provider value={contextValue}>
      <form {...props} {...businessProps}>
        {childrenRender(children, contextValue, <UserInfoEditFormChildren />)}
      </form>
    </UserInfoEditFormContext.Provider>
  );
}

const _UserInfoEditForm = Object.assign(UserInfoEditForm, {
  ...UserInfoEditFormElements,
});
export { _UserInfoEditForm as UserInfoEditForm };
