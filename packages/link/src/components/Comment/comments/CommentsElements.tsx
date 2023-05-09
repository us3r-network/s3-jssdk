import {
  Item as AriaItem,
  ItemProps,
  ListBox,
  ListBoxProps,
} from "react-aria-components";
import { HTMLAttributes } from "react";
import {
  CommentsItemContext,
  useCommentsItemState,
  useCommentsState,
} from "./CommentsContext";
import { childrenRender } from "../../../utils/props";
import { Comment } from "../../../data-model";
import {
  UserAvatar,
  UserAvatarProps,
  UserName,
  UserNameProps,
} from "@us3r-network/profile";

export function Count(props: HTMLAttributes<HTMLSpanElement>) {
  const { commentsCount } = useCommentsState();
  return (
    <span data-count="" {...props}>
      {commentsCount}
    </span>
  );
}

export function List(props: ListBoxProps<Comment>) {
  const { comments } = useCommentsState();
  return <ListBox data-list="" items={comments} {...props} />;
}

export function Item({ children, value, ...props }: ItemProps<Comment>) {
  if (!value) return null;
  return (
    <AriaItem data-item="" key={value.id} {...props}>
      <CommentsItemContext.Provider value={value as Comment}>
        {childrenRender(children, value, <ItemDefaultChildren />)}
      </CommentsItemContext.Provider>
    </AriaItem>
  );
}

export function Avatar(props: UserAvatarProps) {
  const { creator } = useCommentsItemState();
  const did = creator.id;
  return <UserAvatar did={did} {...props} />;
}

export function Name(props: UserNameProps) {
  const { creator } = useCommentsItemState();
  const did = creator.id;
  return <UserName did={did} {...props} />;
}

export function Text(props: HTMLAttributes<HTMLSpanElement>) {
  const { text } = useCommentsItemState();
  return (
    <span data-text="" {...props}>
      {text}
    </span>
  );
}

export function CreateDate(props: HTMLAttributes<HTMLSpanElement>) {
  const { createAt } = useCommentsItemState();
  return (
    <span data-create-date="" {...props}>
      {createAt}
    </span>
  );
}

function ItemDefaultChildren() {
  return (
    <>
      <div>
        <Avatar />
        <Name />
        <CreateDate />
      </div>
      <Text />
    </>
  );
}
