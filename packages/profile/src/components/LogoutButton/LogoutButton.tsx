import { useCallback, useRef } from "react";
import {
  useAuthentication,
  useIsAuthenticated,
} from "@us3r-network/auth-with-rainbowkit";
import { RenderProps, useRenderProps } from "../../utils/props";
import {
  AriaButtonProps,
  mergeProps,
  useButton,
  useFocusRing,
  useHover,
} from "react-aria";

export interface LogoutButtonRenderProps {
  isAuthenticated: boolean;
  disabled: boolean;
}

export interface LogoutButtonProps
  extends Omit<
      AriaButtonProps,
      "children" | "href" | "target" | "rel" | "elementType"
    >,
    RenderProps<LogoutButtonRenderProps> {}

export function LogoutButton({ ...props }: LogoutButtonProps) {
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
