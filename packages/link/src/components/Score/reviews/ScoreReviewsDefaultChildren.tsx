import * as ScoreReviews from "./ScoreReviewsElements";
import { ScoreForm } from "../form/ScoreForm";
import { useScoreReviewsState } from "./ScoreReviewsContext";
import { ScoreDashboard } from "../dashboard";
import { Button, Dialog, Heading, Modal } from "react-aria-components";
import { ReactComponent as EditSvg } from "@material-design-icons/svg/outlined/edit.svg";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useState } from "react";
import { useLinkState } from "../../../LinkStateProvider";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";
import { useLink } from "../../../hooks/useLink";

export function ScoreReviewsDefaultChildren() {
  const { isLoading, linkId } = useScoreReviewsState();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const { link } = useLink(linkId);
  const findCurrUserScore =
    !link?.scores || !session
      ? null
      : link.scores?.edges?.find(
          (edge) => edge?.node?.creator?.id === session?.id
        );

  const isCommented = !!findCurrUserScore && !findCurrUserScore?.node?.revoke;
  return isLoading ? (
    <span data-layout-element="Loading">loading ...</span>
  ) : (
    <div data-layout-element="CompositeWrap">
      <ScoreDashboard linkId={linkId} />
      <Button
        data-layout-element="RatingAndReviewWrapButton"
        isDisabled={isCommented}
        onPress={() => {
          if (isCommented) return;
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
        data-layout-element="RatingAndReviewModel"
        isOpen={isOpenAdd}
        onOpenChange={setIsOpenAdd}
      >
        <Dialog data-layout-element="Dialog">
          <Heading data-layout-element="Heading">Rating & Review</Heading>
          <ScoreForm
            linkId={linkId}
            onSuccessfullySubmit={() => {
              setIsOpenAdd(false);
            }}
          />
        </Dialog>
      </Modal>
    </div>
  );
}
