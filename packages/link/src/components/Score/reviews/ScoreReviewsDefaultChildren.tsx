/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 12:03:31
 * @FilePath: /s3-jssdk/packages/link/src/components/Score/reviews/ScoreReviewsDefaultChildren.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ScoreReviews from "./ScoreReviewsElements";
import { ScoreForm } from "../form/ScoreForm";
import { useScoreReviewsState } from "./ScoreReviewsContext";
import { ScoreDashboard } from "../dashboard";
import { Button } from "react-aria-components";
import { ReactComponent as EditSvg } from "@material-design-icons/svg/outlined/edit.svg";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useState } from "react";
import { useLinkState } from "../../../LinkStateProvider";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";
import { useScoreAction } from "../../../hooks/useScoreAction";
import { Modal } from "../../common/Modal/Modal";

export function ScoreReviewsDefaultChildren() {
  const { isLoading, linkId, link } = useScoreReviewsState();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  const { isScored, isDisabled } = useScoreAction(linkId);
  return isLoading ? (
    <span data-layout-element="Loading">loading ...</span>
  ) : (
    <div data-layout-element="CompositeWrap">
      <ScoreDashboard linkId={linkId} link={link}/>
      <Button
        data-layout-element="RatingAndReviewWrapButton"
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
        <span data-layout-element="Label">
          <EditSvg data-layout-element="Icon" />
          Rating & Review
        </span>
      </Button>

      <ScoreReviews.List>
        {(item) => <ScoreReviews.Item value={item} key={item.id} />}
      </ScoreReviews.List>

      <Modal
        data-layout-element="ScoreAddModel"
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
      </Modal>
    </div>
  );
}
