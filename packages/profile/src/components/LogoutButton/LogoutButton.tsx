import { useCallback, useMemo } from "react";
import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { Button, ButtonProps, ButtonRenderProps } from "react-aria-components";
import { LogoutButtonChildren } from "./LogoutButtonChildren";

export interface LogoutButtonRenderProps {
  /**
   * Whether the user is authenticated.
   */
  isAuthenticated: boolean;
  /**
   * Whether the button is disabled.
   */
  isDisabled: boolean;
}

export interface LogoutButtonProps
  extends ChildrenRenderProps<
    ButtonProps,
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
