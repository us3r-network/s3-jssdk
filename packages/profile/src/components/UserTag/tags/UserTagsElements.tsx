import { ListBox, ListBoxProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useUserTagsState } from "./UserTagsContext";

export function Count(props: HTMLAttributes<HTMLSpanElement>) {
  const { tags } = useUserTagsState();
  return (
    <span data-state-element="Count" {...props}>
      {tags.length}
    </span>
  );
}

export function List(props: ListBoxProps<{ tag: string }>) {
  const { tags } = useUserTagsState();
  const items = tags.map((tag) => ({ tag }));
  return (
    <ListBox
      aria-label="User tags"
      selectionMode="single"
      data-state-element="List"
      items={items}
      {...props}
    />
  );
}
