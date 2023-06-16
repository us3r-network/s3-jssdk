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
      {({ isLoading, linkId }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }

        return (
          <div className={styles.CompositeWrap}>
            <div className={styles.Btns}>
              <FavorButton linkId={linkId} />
              <div className={styles.CountButton}>
                <MessageIcon className={styles.CountIcon} />
                <Comments.Count className={styles.Count} />
              </div>
              <VoteButton linkId={linkId} />
            </div>

            <CommentAddForm linkId={linkId} className={styles.CommentAddForm}/>

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
