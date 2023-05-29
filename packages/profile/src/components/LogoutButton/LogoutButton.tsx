import { useCallback, useMemo, useRef } from "react";
import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";
import { LogoutButtonChildren } from "./LogoutButtonChildren";

export interface LogoutButtonRenderProps {
  isAuthenticated: boolean;
  isDisabled: boolean;
}

export interface LogoutButtonProps
  extends ChildrenRenderProps<
    AriaButtonProps,
    ButtonRenderProps & LogoutButtonRenderProps
  > {}

export function LogoutButton({ children, ...props }: LogoutButtonProps) {
  const { ready, signOut } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const isDisabled = !ready || !isAuthenticated;
  const onClick = useCallback(() => {
    if (!isDisabled && isAuthenticated) {
      signOut();
    }
  }, [isDisabled, isAuthenticated, signOut]);
  const businessProps = {
    "data-us3r-component": "LogoutButton",
    "data-authenticated": isAuthenticated || undefined,
    "data-disabled": isDisabled || undefined,
    isDisabled,
    onClick,
  };
  const businessRenderProps = {
    isAuthenticated,
    isDisabled,
  };

  const defaultChildren = useMemo(
    () => <LogoutButtonChildren {...businessRenderProps} />,
    [businessRenderProps]
  );

  return (
    <Button {...businessProps} {...props}>
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
