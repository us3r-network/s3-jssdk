import { useCallback, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useLinkScores } from "./useLinkScores";

export const useScoreAction = (
  linkId: string,
  opts?: {
    onSuccessfullyScore?: () => void;
    onFailedScore?: (errMsg: string) => void;
  }
) => {
  const { scores, isFetched } = useLinkScores(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const scoringLinkIds = useStore((state) => state.scoringLinkIds);
  const addOneToScoringLinkIds = useStore(
    (state) => state.addOneToScoringLinkIds
  );
  const removeOneFromScoringLinkIds = useStore(
    (state) => state.removeOneFromScoringLinkIds
  );
  const addScoreToCacheLinkScores = useStore(
    (state) => state.addScoreToCacheLinkScores
  );
  const updateScoreInCacheLinkScores = useStore(
    (state) => state.updateScoreInCacheLinkScores
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

  const isDisabled = useMemo(
    () => !isFetched || isScoring,
    [isFetched, isScoring]
  );

  const findCurrUserScore = useMemo(
    () =>
      !session
        ? null
        : scores?.find((node) => node?.creator?.id === session?.id),
    [scores, session]
  );

  const isScored = useMemo(
    () => !!findCurrUserScore && !findCurrUserScore?.revoke,
    [findCurrUserScore]
  );

  const onScoreAdd = useCallback(
    async ({ value, text }: { value: number; text: string }) => {
      if (isDisabled) return;
      if (!session || !s3LinkModalAuthed) {
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
          addScoreToCacheLinkScores(linkId, scoreData);
          addOneToPersonalScores({ ...scoreData });
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
      session,
      s3LinkModalAuthed,
      signIn,
      linkId,
      addOneToScoringLinkIds,
      removeOneFromScoringLinkIds,
      addScoreToCacheLinkScores,
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
      if (!session || !s3LinkModalAuthed) {
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
          updateScoreInCacheLinkScores(linkId, scoreId, scoreData);
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
      session,
      s3LinkModalAuthed,
      signIn,
      linkId,
      addOneToScoringLinkIds,
      removeOneFromScoringLinkIds,
      updateScoreInCacheLinkScores,
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
