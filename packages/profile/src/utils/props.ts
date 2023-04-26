import { CSSProperties, ReactNode } from "react";

export interface StyleProps {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. */
  className?: string;
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/Element/style) for the element. */
  style?: CSSProperties;
}

export type ChildrenRenderProps<T, V> = Omit<T, "children"> &
  StyleProps & {
    children?: React.ReactNode | ((values: V) => ReactNode);
  };

export function childrenRender<T, V>(children: T, values: V) {
  if (typeof children === "function") {
    return children(values);
  } else {
    return children;
  }
}
