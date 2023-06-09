import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { useCallback, useMemo } from "react";
import { Button, ButtonProps, ButtonRenderProps } from "react-aria-components";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { LoginButtonChildren } from "./LoginButtonChildren";

export interface LoginButtonRenderProps {
  /**
   * Whether the user is authenticated.
   */
  isAuthenticated: boolean;
  /**
   * Whether the button is loading. (i.e. the user is being authenticated)
   */
  isLoading: boolean;
  /**
   * Whether the button is disabled.
   */
  isDisabled: boolean;
}
export interface LoginButtonProps
  extends ChildrenRenderProps<
    ButtonProps,
    ButtonRenderProps & LoginButtonRenderProps
  > {}

export function LoginButton({ children, ...props }: LoginButtonProps) {
  const { ready, status, signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const isLoading = ready && status === "loading";
  const isDisabled = !ready || isLoading || isAuthenticated;
  const onClick = useCallback(() => {
    if (!isDisabled && !isAuthenticated) {
      signIn();
    }
  }, [isDisabled, isAuthenticated, signIn]);
  const businessProps = {
    "data-us3r-component": "LoginButton",
    "data-authenticated": isAuthenticated || undefined,
    "data-loading": isLoading || undefined,
    "data-disabled": isDisabled || undefined,
    onClick,
  };

  const businessRenderProps = {
    isAuthenticated,
    isLoading,
    isDisabled,
  };

  const defaultChildren = useMemo(
    () => <LoginButtonChildren {...businessRenderProps} />,
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
