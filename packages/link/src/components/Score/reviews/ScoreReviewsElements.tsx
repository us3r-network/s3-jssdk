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
import { childrenRender } from "../../../utils/props";
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

export function List(props: ListBoxProps<Score>) {
  const { scores } = useScoreReviewsState();
  return <ListBox data-list="" items={scores} {...props} />;
}

export function Item({ children, value, ...props }: ItemProps<Score>) {
  if (!value) return null;
  return (
    <AriaItem data-item="" key={value.id} {...props}>
      <ScoreReviewsItemContext.Provider value={value as Score}>
        {childrenRender(children, value, <ItemDefaultChildren />)}
      </ScoreReviewsItemContext.Provider>
    </AriaItem>
  );
}

export function Avatar(props: UserAvatarProps) {
  const { creator } = useScoreReviewsItemState();
  const did = creator.id;
  return <UserAvatar did={did} {...props} />;
}

export function Name(props: UserNameProps) {
  const { creator } = useScoreReviewsItemState();
  const did = creator.id;
  return <UserName did={did} {...props} />;
}

export function Text(props: HTMLAttributes<HTMLSpanElement>) {
  const { text } = useScoreReviewsItemState();
  return (
    <span data-text="" {...props}>
      {text}
    </span>
  );
}
export function Value(props: HTMLAttributes<HTMLSpanElement>) {
  const { value } = useScoreReviewsItemState();
  return (
    <span data-value="" {...props}>
      {value}
    </span>
  );
}

export function CreateDate(props: HTMLAttributes<HTMLSpanElement>) {
  const { createAt } = useScoreReviewsItemState();
  return (
    <span data-create-date="" {...props}>
      {createAt}
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
        <CreateDate />
      </div>
      <div>
        <Value />
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
      <Text />
    </>
  );
}
