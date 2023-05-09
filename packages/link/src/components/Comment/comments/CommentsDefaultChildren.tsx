import * as Comments from "./CommentsElements";
import { CommentAddForm } from "../add-form/CommentAddForm";
import { useCommentsState } from "./CommentsContext";

export function CommentsDefaultChildren() {
  const { loading, linkId } = useCommentsState();
  return loading ? (
    <>loading ...</>
  ) : (
    <>
      <CommentAddForm linkId={linkId} />
      <Comments.List>
        {(item) => <Comments.Item value={item} key={item.id} />}
      </Comments.List>
    </>
  );
}
