/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 11:35:51
 * @FilePath: /s3-jssdk/packages/link/src/ui/Comment/comments/Comments.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { Comments, CommentsProps } from "@us3r-network/link";
import FavorButton from "../../FavorButton/FavorButton";
import VoteButton from "../../VoteButton/VoteButton";
import CommentAddForm from "../add-form/CommentAddForm";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import { ReactComponent as MessageIcon } from "@material-design-icons/svg/outlined/message.svg";

import styles from "./Comments.module.css";

export default function ({ className = "", ...props }: CommentsProps) {
  return (
    <Comments className={`${styles.Comments} ${className}`} {...props}>
      {({ isLoading, linkId, link }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }

        return (
          <div className={styles.CompositeWrap}>
            <div className={styles.Btns}>
              <FavorButton linkId={linkId} link={link}/>
              <div className={styles.CountButton}>
                <MessageIcon className={styles.CountIcon} />
                <Comments.Count className={styles.Count} />
              </div>
              <VoteButton linkId={linkId} link={link}/>
            </div>

            <CommentAddForm linkId={linkId} link={link} className={styles.CommentAddForm}/>

            <Comments.List className={styles.List}>
              {(item) => (
                <Comments.Item
                  value={item}
                  key={item.id}
                  className={styles.Item}
                >
                  <div className={styles.UserInfo}>
                    <Comments.Avatar className={styles.Avatar} />
                    <div className={styles.NameAndDate}>
                      <Comments.Name />
                      <Comments.CreateAt />
                    </div>
                  </div>
                  <Comments.Text className={styles.Text} />
                </Comments.Item>
              )}
            </Comments.List>
          </div>
        );
      }}
    </Comments>
  );
}
