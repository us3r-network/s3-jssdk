import {
  Item as AriaItem,
  Button,
  ItemProps,
  ItemRenderProps,
  ListBox,
  ListBoxProps,
} from "react-aria-components";
import { HTMLAttributes, useState } from "react";
import {
  ScoreReviewsItemContext,
  ScoreReviewsItemContextValue,
  useScoreReviewsItemState,
  useScoreReviewsState,
} from "./ScoreReviewsContext";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { Score } from "../../../data-model";
import {
  UserAvatar,
  UserAvatarProps,
  UserName,
  UserNameProps,
} from "@us3r-network/profile";
import { ReactComponent as EditSvg } from "@material-design-icons/svg/outlined/edit.svg";
import {
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { ScoreForm } from "../form";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";
import { Modal } from "../../common/Modal/Modal";

export function List(props: ListBoxProps<Score>) {
  const { scores } = useScoreReviewsState();
  return (
    <ListBox
      aria-label="Score reviews"
      data-state-element="List"
      items={scores}
      {...props}
    />
  );
}

export function Item({
  children,
  value,
  ...props
}: ChildrenRenderProps<
  ItemProps<Score>,
  ItemRenderProps & ScoreReviewsItemContextValue
>) {
  if (!value) {
    throw new Error("ScoreReviews.Item must have a value");
  }
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const did = value.creator.id;
  const isLoginUserScore =
    isAuthenticated && !!session?.id && !!did && session.id === did;
  const contextValue = {
    data: value,
    isLoginUserScore,
  };
  return (
    <AriaItem
      data-state-element="Item"
      key={value.id}
      textValue={value.id}
      {...props}
    >
      <ScoreReviewsItemContext.Provider value={contextValue}>
        {childrenRender(children, value, <ItemDefaultChildren />)}
      </ScoreReviewsItemContext.Provider>
    </AriaItem>
  );
}

export function Avatar(props: UserAvatarProps) {
  const {
    data: { creator },
  } = useScoreReviewsItemState();
  const did = creator.id;
  return <UserAvatar data-state-element="Avatar" did={did} {...props} />;
}

export function Name(props: UserNameProps) {
  const {
    data: { creator },
  } = useScoreReviewsItemState();
  const did = creator.id;
  return <UserName data-state-element="Name" did={did} {...props} />;
}

export function Text({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    value: number;
  }
>) {
  const {
    data: { text },
  } = useScoreReviewsItemState();
  return (
    <span data-state-element="Text" {...props}>
      {childrenRender(children, { text }, text)}
    </span>
  );
}

export function Value({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    value: number;
  }
>) {
  const {
    data: { value },
  } = useScoreReviewsItemState();
  return (
    <span data-state-element="Value" {...props}>
      {childrenRender(children, { value }, <RatingStarSelect value={value} />)}
    </span>
  );
}

export function CreateAt({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    value: number;
  }
>) {
  const {
    data: { createAt },
  } = useScoreReviewsItemState();
  return (
    <span data-state-element="createAt" {...props}>
      {childrenRender(children, { createAt }, createAt)}
    </span>
  );
}

function ItemDefaultChildren() {
  const { linkId } = useScoreReviewsState();
  const { data, isLoginUserScore } = useScoreReviewsItemState();
  const { id } = data;
  const [isOpenEdit, setIsOpenEdit] = useState(false);

  return (
    <>
      <div data-layout-element="ScoreValueWrap">
        <Value />
        {isLoginUserScore && (
          <>
            <Button
              data-layout-element="EditButton"
              onPress={() => {
                setIsOpenEdit(true);
              }}
            >
              <EditSvg data-layout-element="Icon" />
              Edit
            </Button>
            <Modal
              data-layout-element="ScoreEditModel"
              isDismissable
              title="Rating & Review"
              isOpen={isOpenEdit}
              onOpenChange={setIsOpenEdit}
            >
              <ScoreForm
                linkId={linkId}
                scoreId={id}
                onSuccessfullyScore={() => {
                  setIsOpenEdit(false);
                }}
              />
            </Modal>
          </>
        )}
      </div>
      <Text />
      <div data-layout-element="UserInfo">
        <Avatar />
        <div data-layout-element="NameAndDate">
          <Name />
          <CreateAt />
        </div>
      </div>
    </>
  );
}
