import * as ScoreReviews from "./ScoreReviewsElements";
import { ScoreForm } from "../form/ScoreForm";
import { useScoreReviewsState } from "./ScoreReviewsContext";
import { ScoreDashboard } from "../dashboard";
import { Button, Dialog, Heading, Modal } from "react-aria-components";
import EditSvg from "@material-design-icons/svg/outlined/edit.svg";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useState } from "react";
import { useLinkState } from "../../../LinkStateProvider";

export function ScoreReviewsDefaultChildren() {
  const { isLoading, linkId } = useScoreReviewsState();
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  return isLoading ? (
    <div data-loading="">loading ...</div>
  ) : (
    <div data-score-box="">
      <section>
        <ScoreDashboard linkId={linkId} />
      </section>
      <section>
        <Button
          onPress={() => {
            if (!session || !s3LinkModalAuthed) {
              signIn();
              return;
            }
            setIsOpenAdd(true);
          }}
        >
          <EditSvg />
          Rating & Review
        </Button>
        <Modal data-modal="" isOpen={isOpenAdd} onOpenChange={setIsOpenAdd}>
          <Dialog>
            <Heading data-heading="">Rating & Review</Heading>
            <ScoreForm
              linkId={linkId}
              onSuccessfullySubmit={() => {
                setIsOpenAdd(false);
              }}
            />
          </Dialog>
        </Modal>
      </section>
      <section>
        <ScoreReviews.List>
          {(item) => <ScoreReviews.Item value={item} key={item.id} />}
        </ScoreReviews.List>
      </section>
    </div>
  );
}
