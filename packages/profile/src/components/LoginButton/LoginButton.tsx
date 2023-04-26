import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { useCallback, useRef } from "react";
import {
  AriaButtonProps,
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
} from "react-aria";
import { RenderProps, useRenderProps } from "../../utils/props";

export interface LoginButtonRenderProps {
  isAuthenticated: boolean;
  loading: boolean;
  disabled: boolean;
}
export interface LoginButtonProps
  extends Omit<
      AriaButtonProps,
      "children" | "href" | "target" | "rel" | "elementType"
    >,
    RenderProps<LoginButtonRenderProps> {}

export function LoginButton({ ...props }: LoginButtonProps) {
  const ref = useRef(null);

  // Use react-aria to complete cross-platform barrier-free interaction
  const { buttonProps, isPressed } = useButton(props as AriaButtonProps, ref);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing(props);
  const { hoverProps, isHovered } = useHover(props);
  const baseProps = {
    ...mergeProps(buttonProps, focusProps, hoverProps),
    "data-pressed": isPressed || undefined,
    "data-focused": isFocused || undefined,
    "data-focus-visible": isFocusVisible || undefined,
    "data-hovered": isHovered || undefined,
  };

  // The business state that the component cares about
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

  // Subcomponent rendering function and props used
  const baseRenderProps = {
    isHovered,
    isPressed,
    isFocused,
    isFocusVisible,
    isDisabled: props.isDisabled || false,
  };
  const businessRenderProps = {
    isAuthenticated,
    loading,
    disabled,
  };

  //
  const renderProps = useRenderProps({
    ...props,
    values: { ...baseRenderProps, ...businessRenderProps },
  });

  return (
    <button ref={ref} {...baseProps} {...businessProps} {...renderProps} />
  );
}
