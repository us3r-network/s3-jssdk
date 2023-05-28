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
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { Comment } from "../../../data-model";
import {
  UserAvatar,
  UserAvatarProps,
  UserName,
  UserNameProps,
} from "@us3r-network/profile";
import { formatDateFromNow } from "../../../utils/time";

export function Count({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    commentsCount: number;
  }
>) {
  const { commentsCount } = useCommentsState();
  return (
    <span data-state-element="Count" {...props}>
      {childrenRender(children, { commentsCount }, commentsCount)}
    </span>
  );
}

export function List(props: ListBoxProps<Comment>) {
  const { comments } = useCommentsState();
  return (
    <ListBox
      aria-label="Comment list"
      data-state-element="List"
      items={comments}
      {...props}
    />
  );
}

export function Item({ children, value, ...props }: ItemProps<Comment>) {
  if (!value) return null;
  return (
    <AriaItem
      data-state-element="Item"
      key={value.id}
      textValue={value.id}
      {...props}
    >
      <CommentsItemContext.Provider value={value as Comment}>
        {childrenRender(children, value, <ItemDefaultChildren />)}
      </CommentsItemContext.Provider>
    </AriaItem>
  );
}

export function Avatar(props: UserAvatarProps) {
  const { creator } = useCommentsItemState();
  const did = creator.id;
  return <UserAvatar data-state-element="Avatar" did={did} {...props} />;
}

export function Name(props: UserNameProps) {
  const { creator } = useCommentsItemState();
  const did = creator.id;
  return <UserName data-state-element="Name" did={did} {...props} />;
}

export function Text({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    text: string;
  }
>) {
  const { text } = useCommentsItemState();
  return (
    <span data-state-element="Text" {...props}>
      {childrenRender(children, { text }, text)}
    </span>
  );
}

export function CreateAt({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    createAt: string;
  }
>) {
  const { createAt } = useCommentsItemState();
  return (
    <span data-state-element="CreateAt" {...props}>
      {childrenRender(children, { createAt }, formatDateFromNow(createAt))}
    </span>
  );
}

function ItemDefaultChildren() {
  return (
    <>
      <div data-layout-element="UserInfo">
        <Avatar />
        <div data-layout-element="NameAndDate">
          <Name />
          <CreateAt />
        </div>
      </div>
      <Text />
    </>
  );
}
