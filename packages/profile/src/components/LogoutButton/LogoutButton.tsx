import { useCallback, useRef } from "react";
import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";

export interface LogoutButtonRenderProps {
  isAuthenticated: boolean;
  disabled: boolean;
}

export interface LogoutButtonProps
  extends ChildrenRenderProps<
    AriaButtonProps,
    ButtonRenderProps & LogoutButtonRenderProps
  > {}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const { ready, signOut } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const disabled = !ready || !isAuthenticated;
  const onClick = useCallback(() => {
    if (!disabled && isAuthenticated) {
      signOut();
    }
  }, [disabled, isAuthenticated, signOut]);
  const businessProps = {
    "data-authenticated": isAuthenticated || undefined,
    "data-disabled": disabled || undefined,
    onClick,
  };
  const businessRenderProps = {
    isAuthenticated,
    disabled,
  };

  return (
    <Button {...props} {...businessProps}>
      {(buttonProps) =>
        childrenRender(children, { ...buttonProps, ...businessRenderProps })
      }
    </Button>
  );
}
