import { useEffect, useState } from "react";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { Modal, ModalOverlayProps } from "react-aria-components";
import { UserInfoEditForm } from "./UserInfoEditForm";
import {
  UserInfoEditModalContext,
  UserInfoEditModalContextValue,
} from "./contexts";

export interface UserInfoEditModalProps
  extends ChildrenRenderProps<
    ModalOverlayProps,
    UserInfoEditModalContextValue
  > {}

export function UserInfoEditModal({
  children,
  isOpen: _isOpen,
  onOpenChange: _onOpenChange,
  ...props
}: UserInfoEditModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(_isOpen || false);
  }, [_isOpen]);

  useEffect(() => {
    if (_onOpenChange) {
      _onOpenChange(isOpen);
    }
  }, [isOpen, _onOpenChange]);

  const businessProps = {
    "data-us3r-userinfo-edit-modal": "",
    "data-open": isOpen || undefined,
  };
  const contextValue = {
    isOpen,
    setIsOpen,
  };
  return (
    <UserInfoEditModalContext.Provider value={contextValue}>
      <Modal
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        {...props}
        {...businessProps}
      >
        {childrenRender(children, contextValue, <UserInfoEditForm />)}
      </Modal>
    </UserInfoEditModalContext.Provider>
  );
}
