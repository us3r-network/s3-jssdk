import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { useCallback } from "react";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";

export interface LoginButtonRenderProps {
  isAuthenticated: boolean;
  loading: boolean;
  disabled: boolean;
}
export interface LoginButtonProps
  extends ChildrenRenderProps<
    AriaButtonProps,
    ButtonRenderProps & LoginButtonRenderProps
  > {}

export function LoginButton({ children, ...props }: LoginButtonProps) {
  const { ready, status, signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const loading = ready && status === "loading";
  const disabled = !ready || loading || isAuthenticated;
  const onClick = useCallback(() => {
    if (!disabled && !isAuthenticated) {
      signIn();
    }
  }, [disabled, isAuthenticated, signIn]);
  const businessProps = {
    "data-authenticated": isAuthenticated || undefined,
    "data-loading": loading || undefined,
    "data-disabled": disabled || undefined,
    onClick,
  };

  const businessRenderProps = {
    isAuthenticated,
    loading,
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
