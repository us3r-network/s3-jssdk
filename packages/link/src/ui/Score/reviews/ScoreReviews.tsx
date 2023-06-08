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
  const { isScored, isDisabled } = useScoreAction(props.linkId);
  return (
    <ScoreReviews className={`${styles.ScoreReviews} ${className}`} {...props}>
      {({ isLoading, linkId }) => {
        if (isLoading) {
          return <LoadingSpokes className={styles.LoadingSpokes} />;
        }
        return (
          <div className={styles.CompositeWrap}>
            <ScoreDashboard linkId={linkId} />
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
