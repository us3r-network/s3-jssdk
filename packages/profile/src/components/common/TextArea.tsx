import { TextareaHTMLAttributes } from "react";
import { mergeProps, useFocusRing, useHover } from "react-aria";

export interface TextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {}
export function TextArea(props: TextAreaProps) {
  const { hoverProps, isHovered } = useHover({});
  const { isFocused, isFocusVisible, focusProps } = useFocusRing({
    autoFocus: props.autoFocus,
  });
  return (
    <textarea
      {...mergeProps(props, focusProps, hoverProps)}
      data-hovered={isHovered || undefined}
      data-focused={isFocused || undefined}
      data-focus-visible={isFocusVisible || undefined}
    />
  );
}
