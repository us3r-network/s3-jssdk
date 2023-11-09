import {
  ListBoxItem as AriaItem,
  ItemProps,
  ListBox,
  ListBoxProps,
} from "react-aria-components";
import { HTMLAttributes } from "react";
import { useUserTagsState } from "./UserTagsContext";

function Count(props: HTMLAttributes<HTMLSpanElement>) {
  const { tags } = useUserTagsState();
  return (
    <span data-state-element="Count" {...props}>
      {tags.length}
    </span>
  );
}

function List(props: ListBoxProps<{ tag: string }>) {
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

function Item({ children, value, ...props }: ItemProps<{ tag: string }>) {
  return (
    <AriaItem
      data-state-element="Item"
      key={value?.tag}
      textValue={value?.tag}
      {...props}
    >
      {value?.tag}
    </AriaItem>
  );
}

export default {
  Count,
  List,
  Item,
};
