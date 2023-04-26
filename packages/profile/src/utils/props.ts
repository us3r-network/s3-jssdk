import isFunction from "lodash/isFunction";
import { CSSProperties, ReactNode } from "react";
import { filterDOMProps } from "@react-aria/utils";
import {
  AriaLabelingProps,
  DOMProps as SharedDOMProps,
} from "@react-types/shared";

export interface StyleProps {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. */
  className?: string;
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/Element/style) for the element. */
  style?: CSSProperties;
}

export interface DOMProps extends StyleProps {
  /** The children of the component. */
  children?: ReactNode;
}

export interface StyleRenderProps<T> {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. A function may be provided to compute the class based on component state. */
  className?: string | ((values: T) => string);
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/Element/style) for the element. A function may be provided to compute the style based on component state. */
  style?: CSSProperties | ((values: T) => CSSProperties);
}

export interface RenderProps<T> extends StyleRenderProps<T> {
  /** The children of the component. A function may be provided to alter the children based on component state. */
  children?: ReactNode | ((values: T) => ReactNode);
}

interface RenderPropsHookOptions<T>
  extends RenderProps<T>,
    SharedDOMProps,
    AriaLabelingProps {
  values: T;
}

export function useRenderProps<T>({
  className,
  style,
  children,
  values,
  ...otherProps
}: RenderPropsHookOptions<T>) {
  if (typeof className === "function") {
    className = className(values);
  }

  if (typeof style === "function") {
    style = style(values);
  }

  if (typeof children === "function") {
    children = children(values);
  }

  delete otherProps.id;
  return {
    ...filterDOMProps(otherProps),
    className,
    style,
    children,
  };
}
