/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 12:49:59
 * @FilePath: /s3-jssdk/packages/link/src/ui/Score/reviews/ScoreReviews.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useState } from "react";
import { Button } from "react-aria-components";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import {
  ScoreReviews,
  ScoreReviewsProps,
  useLinkState,
  useScoreAction,
} from "@us3r-network/link";

import ModalBase from "../../common/modal/ModalBase";
import LoadingSpokes from "../../common/loading/LoadingSpokes";
import RatingStarSelect from "../../common/rating-star/RatingStarSelect";
import ScoreDashboard from "../dashboard/ScoreDashboard";
import ScoreForm from "../form/ScoreForm";
import { ReactComponent as EditSvg } from "@material-design-icons/svg/outlined/edit.svg";
import styles from "./ScoreReviews.module.css";

export default function ({ className = "", ...props }: ScoreReviewsProps) {
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  const { isScored, isDisabled } = useScoreAction(props.linkId, props.link);
  return (
    <ScoreReviews className={`${styles.ScoreReviews} ${className}`} {...props}>
      {({ isLoading, linkId, link }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }
        return (
          <div className={styles.CompositeWrap}>
            <ScoreDashboard linkId={linkId} link={link}/>
            <Button
              className={styles.RatingAndReviewWrapButton}
              isDisabled={isDisabled || isScored}
              onPress={() => {
                if (!session || !s3LinkModalAuthed) {
                  signIn();
                  return;
                }
                setIsOpenAdd(true);
              }}
            >
              <RatingStarSelect value={0} />
              <span className={styles.Label}>
                <EditSvg className={styles.Icon} />
                Rating & Review
              </span>
            </Button>

            <ScoreReviews.List className={styles.List}>
              {(item) => (
                <ScoreReviews.Item
                  className={styles.Item}
                  value={item}
                  key={item.id}
                >
                  <div className={styles.ScoreValueWrap}>
                    <ScoreReviews.Value>
                      {({ value }) => <RatingStarSelect value={value} />}
                    </ScoreReviews.Value>
                  </div>
                  <ScoreReviews.Text className={styles.Text} />
                  <div className={styles.UserInfo}>
                    <ScoreReviews.Avatar className={styles.UserAvatar} />
                    <div className={styles.NameAndDate}>
                      <ScoreReviews.Name className={styles.UserName} />
                      <ScoreReviews.CreateAt />
                    </div>
                  </div>
                </ScoreReviews.Item>
              )}
            </ScoreReviews.List>

            <ModalBase
              modalClassName={styles.ScoreAddModel}
              isDismissable
              isOpen={isOpenAdd}
              onOpenChange={setIsOpenAdd}
              title="Rating & Review"
            >
              <ScoreForm
                linkId={linkId}
                link={link}
                onSuccessfullyScore={() => {
                  setIsOpenAdd(false);
                }}
              />
            </ModalBase>
          </div>
        );
      }}
    </ScoreReviews>
  );
}
