import { useCallback, useMemo, useRef } from "react";
import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";
import { LogoutButtonChildren } from "./default-ui/LogoutButtonChildren";

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
    "data-us3r-logoutbutton": "",
    "data-authenticated": isAuthenticated || undefined,
    "data-disabled": disabled || undefined,
    onClick,
  };
  const businessRenderProps = {
    isAuthenticated,
    disabled,
  };

  const defaultChildren = useMemo(
    () => <LogoutButtonChildren {...businessRenderProps} />,
    [businessRenderProps]
  );

  return (
    <Button {...props} {...businessProps}>
      {(buttonProps) =>
        childrenRender(
          children,
          { ...buttonProps, ...businessRenderProps },
          defaultChildren
        )
      }
    </Button>
  );
}
