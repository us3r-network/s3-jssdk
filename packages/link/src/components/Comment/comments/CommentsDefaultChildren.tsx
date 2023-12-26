/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 11:30:47
 * @FilePath: /s3-jssdk/packages/link/src/components/Comment/comments/CommentsDefaultChildren.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import Comments from "./CommentsElements";
import { CommentAddForm } from "../add-form/CommentAddForm";
import { useCommentsState } from "./CommentsContext";
import { FavorButton } from "../../FavorButton";
import { VoteButton } from "../../VoteButton";
import { ReactComponent as MessageIcon } from "@material-design-icons/svg/outlined/message.svg";

export function CommentsDefaultChildren() {
  const { isLoading, linkId, link } = useCommentsState();
  console.log("linkId", linkId, link);
  return isLoading ? (
    <span data-layout-element="Loading">loading ...</span>
  ) : (
    <div data-layout-element="CompositeWrap">
      <div data-layout-element="Btns">
        <FavorButton linkId={linkId} link={link}/>
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
        <VoteButton linkId={linkId} link={link}/>
      </div>
      <CommentAddForm linkId={linkId} link={link}/>
      <Comments.List>
        {(item) => <Comments.Item value={item} key={item.id} />}
      </Comments.List>
    </div>
  );
}
