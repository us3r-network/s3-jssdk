import { useCallback, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { useLink } from "./useLink";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";

export const useScoreAction = (
  linkId: string,
  opts?: {
    onSuccessfullyScore?: () => void;
    onFailedScore?: (errMsg: string) => void;
  }
) => {
  const { link } = useLink(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const scoringLinkIds = useStore((state) => state.scoringLinkIds);
  const addOneToScoringLinkIds = useStore(
    (state) => state.addOneToScoringLinkIds
  );
  const removeOneFromScoringLinkIds = useStore(
    (state) => state.removeOneFromScoringLinkIds
  );
  const addScoreToCacheLinks = useStore((state) => state.addScoreToCacheLinks);
  const updateScoreInCacheLinks = useStore(
    (state) => state.updateScoreInCacheLinks
  );

  const addOneToPersonalScores = useStore(
    (state) => state.addOneToPersonalScores
  );
  const updateOneInPersonalScores = useStore(
    (state) => state.updateOneInPersonalScores
  );

  const isScoring = useMemo(
    () => scoringLinkIds.has(linkId),
    [scoringLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isScoring, [link, isScoring]);

  const findCurrUserScore =
    !link?.scores || !session
      ? null
      : link.scores?.edges?.find(
          (edge) => edge?.node?.creator?.id === session?.id
        );

  const isScored = !!findCurrUserScore && !findCurrUserScore?.node?.revoke;

  const onScoreAdd = useCallback(
    async ({ value, text }: { value: number; text: string }) => {
      if (isDisabled) return;
      if (!isAuthenticated || !session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      try {
        addOneToScoringLinkIds(linkId);
        const res = await s3LinkModel?.createScore({
          value,
          text,
          linkID: linkId,
          revoke: false,
        });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const id = res?.data?.createScore.document.id;
        if (id) {
          const scoreData = {
            id,
            value,
            text,
            linkID: linkId,
            revoke: false,
            createAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            creator: {
              id: session.id,
            },
          };
          // update store
          addScoreToCacheLinks(linkId, scoreData);
          addOneToPersonalScores({ ...scoreData, link: link });
        }

        if (opts?.onSuccessfullyScore) opts.onSuccessfullyScore();
      } catch (error) {
        const errMsg = (error as any)?.message;
        if (opts?.onFailedScore) opts.onFailedScore(errMsg);
      } finally {
        removeOneFromScoringLinkIds(linkId);
      }
    },
    [
      isDisabled,
      isAuthenticated,
      session,
      s3LinkModalAuthed,
      signIn,
      linkId,
      link,
      addOneToScoringLinkIds,
      removeOneFromScoringLinkIds,
      addScoreToCacheLinks,
      opts?.onSuccessfullyScore,
      opts?.onFailedScore,
      addOneToPersonalScores,
    ]
  );

  const onScoreEdit = useCallback(
    async ({
      scoreId,
      value,
      text,
    }: {
      scoreId: string;
      value: number;
      text: string;
    }) => {
      if (isDisabled) return;
      if (!isAuthenticated || !session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      try {
        addOneToScoringLinkIds(linkId);
        const res = await s3LinkModel?.updateScore(scoreId, {
          value,
          text,
        });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const id = res?.data?.updateScore.document.id;
        if (id) {
          const scoreData = {
            value,
            text,
            modifiedAt: new Date().toISOString(),
          };
          // update store
          updateScoreInCacheLinks(linkId, scoreId, scoreData);
          updateOneInPersonalScores(scoreId, scoreData);
        }

        if (opts?.onSuccessfullyScore) opts.onSuccessfullyScore();
      } catch (error) {
        const errMsg = (error as any)?.message;
        if (opts?.onFailedScore) opts.onFailedScore(errMsg);
      } finally {
        removeOneFromScoringLinkIds(linkId);
      }
    },
    [
      isDisabled,
      isAuthenticated,
      session,
      s3LinkModalAuthed,
      signIn,
      linkId,
      addOneToScoringLinkIds,
      removeOneFromScoringLinkIds,
      updateScoreInCacheLinks,
      opts?.onSuccessfullyScore,
      opts?.onFailedScore,
      updateOneInPersonalScores,
    ]
  );

  return {
    isScored,
    isScoring,
    isDisabled,
    onScoreAdd,
    onScoreEdit,
  };
};
