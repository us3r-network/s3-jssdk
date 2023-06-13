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
  const { isLoading, linkId } = useScoreReviewsState();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  const { isScored, isDisabled } = useScoreAction(linkId);
  return isLoading ? (
    <span data-layout-element="Loading">loading ...</span>
  ) : (
    <div data-layout-element="CompositeWrap">
      <ScoreDashboard linkId={linkId} />
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
          onSuccessfullyScore={() => {
            setIsOpenAdd(false);
          }}
        />
      </Modal>
    </div>
  );
}
