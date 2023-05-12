import {
  Item as AriaItem,
  Button,
  Dialog,
  Heading,
  ItemProps,
  ListBox,
  ListBoxProps,
  Modal,
} from "react-aria-components";
import { HTMLAttributes, useState } from "react";
import {
  ScoreReviewsItemContext,
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
import EditSvg from "@material-design-icons/svg/outlined/edit.svg";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { ScoreForm } from "../form";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";

export function List(props: ListBoxProps<Score>) {
  const { scores } = useScoreReviewsState();
  return <ListBox data-state-element="List" items={scores} {...props} />;
}

export function Item({ children, value, ...props }: ItemProps<Score>) {
  if (!value) return null;
  return (
    <AriaItem data-state-element="Item" key={value.id} {...props}>
      <ScoreReviewsItemContext.Provider value={value as Score}>
        {childrenRender(children, value, <ItemDefaultChildren />)}
      </ScoreReviewsItemContext.Provider>
    </AriaItem>
  );
}

export function Avatar(props: UserAvatarProps) {
  const { creator } = useScoreReviewsItemState();
  const did = creator.id;
  return <UserAvatar data-state-element="Avatar" did={did} {...props} />;
}

export function Name(props: UserNameProps) {
  const { creator } = useScoreReviewsItemState();
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
  const { text } = useScoreReviewsItemState();
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
  const { value } = useScoreReviewsItemState();
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
  const { createAt } = useScoreReviewsItemState();
  return (
    <span data-state-element="createAt" {...props}>
      {childrenRender(children, { createAt }, createAt)}
    </span>
  );
}

function ItemDefaultChildren() {
  const { id, creator, linkID } = useScoreReviewsItemState();
  const session = useSession();
  const did = creator.id;
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const showEditBtn = session && did && session?.id === did;
  return (
    <>
      <div>
        <Avatar />
        <Name />
        <CreateAt />
        {showEditBtn && (
          <>
            <Button
              onPress={() => {
                setIsOpenEdit(true);
              }}
            >
              <EditSvg />
              Edit
            </Button>
            <Modal
              data-modal=""
              isOpen={isOpenEdit}
              onOpenChange={setIsOpenEdit}
            >
              <Dialog>
                <Heading data-heading="">Rating & Review</Heading>
                <ScoreForm
                  linkId={linkID}
                  scoreId={id}
                  onSuccessfullySubmit={() => {
                    setIsOpenEdit(false);
                  }}
                />
              </Dialog>
            </Modal>
          </>
        )}
      </div>
      <Value />
      <Text />
    </>
  );
}
