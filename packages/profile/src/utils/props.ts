import { CSSProperties, ReactNode } from "react";

export interface StyleProps {
  /** The CSS [className](https://developer.mozilla.org/en-US/docs/Web/API/Element/className) for the element. */
  className?: string;
  /** The inline [style](https://developer.mozilla.org/en-US/docs/Web/API/Element/style) for the element. */
  style?: CSSProperties;
}

export type ChildrenRenderProps<T, O, N> = Omit<T, "children"> &
  StyleProps & {
    children?: React.ReactNode | ((values: O & N) => ReactNode);
  };

export function childrenRender<T, O, N>(children: T, oValues: O, nValues: N) {
  if (typeof children === "function") {
    return children({ ...oValues, ...nValues });
  } else {
    return children;
  }
}
