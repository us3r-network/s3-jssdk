import Comments from "./CommentsElements";
import { CommentAddForm } from "../add-form/CommentAddForm";
import { useCommentsState } from "./CommentsContext";
import { FavorButton } from "../../FavorButton";
import { VoteButton } from "../../VoteButton";
import { ReactComponent as MessageIcon } from "@material-design-icons/svg/outlined/message.svg";

export function CommentsDefaultChildren() {
  const { isLoading, linkId } = useCommentsState();
  return isLoading ? (
    <span data-layout-element="Loading">loading ...</span>
  ) : (
    <div data-layout-element="CompositeWrap">
      <div data-layout-element="Btns">
        <FavorButton linkId={linkId} />
        <Comments.Count>
          {({ commentsCount }) => {
            return (
              <>
                <MessageIcon data-layout-element="Icon" />
                {commentsCount}
              </>
            );
          }}
        </Comments.Count>
        <VoteButton linkId={linkId} />
      </div>
      <CommentAddForm linkId={linkId} />
      <Comments.List>
        {(item) => <Comments.Item value={item} key={item.id} />}
      </Comments.List>
    </div>
  );
}
