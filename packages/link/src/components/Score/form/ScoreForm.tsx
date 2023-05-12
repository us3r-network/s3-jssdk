import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as ScoreFormElements from "./ScoreFormElements";
import { ScoreFormContext, ScoreFormContextValue } from "./ScoreFormContext";
import { ScoreFormDefaultChildren } from "./ScoreFormDefaultChildren";
import { getS3LinkModel, useLinkState } from "../../../LinkStateProvider";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useStore } from "../../../store";
import { useLink } from "../../../hooks/useLink";
import { getScoresFromLink } from "../../../utils/score";

export interface ScoreFormIncomingProps {
  linkId: string;
  scoreId?: string;
  onSuccessfullySubmit?: () => void;
}

export interface ScoreFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      ScoreFormContextValue
    >,
    ScoreFormIncomingProps {}

function ScoreFormRoot({
  linkId,
  scoreId,
  children,
  onSuccessfullySubmit,
  ...props
}: ScoreFormProps) {
  const { isFetching, link } = useLink(linkId);
  const scores = useMemo(
    () => (!isFetching && link ? getScoresFromLink(link) : []),
    [isFetching, link]
  );
  const score = useMemo(
    () => (scoreId ? scores.find((s) => s.id === scoreId) : null),
    [scores, scoreId]
  );
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

  const isScoring = useMemo(
    () => scoringLinkIds.has(linkId),
    [scoringLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isScoring, [link, isScoring]);

  const [value, setValue] = useState(0);
  const [text, setText] = useState("");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (score) {
      setValue(score.value);
      setText(score.text);
    }
  }, [score]);

  useEffect(() => {
    setErrMsg("");
  }, [text]);

  const submitScore = useCallback(async () => {
    try {
      if (isDisabled) return;
      if (!session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      addOneToScoringLinkIds(linkId);
      if (!scoreId) {
        // add
        const res = await s3LinkModel?.createScore({
          value,
          text,
          linkID: linkId,
          revoke: false,
        });
        const id = res?.data?.createScore.document.id;

        if (id) {
          // update store
          addScoreToCacheLinks(linkId, {
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
          });
        }
      } else {
        // edit
        const res = await s3LinkModel?.updateScore(scoreId, {
          value,
          text,
        });
        const id = res?.data?.updateScore.document.id;
        if (id) {
          // update store
          updateScoreInCacheLinks(linkId, scoreId, {
            value,
            text,
            modifiedAt: new Date().toISOString(),
          });
        }
      }

      if (onSuccessfullySubmit) onSuccessfullySubmit();
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      removeOneFromScoringLinkIds(linkId);
    }
  }, [
    value,
    text,
    isDisabled,
    session,
    s3LinkModalAuthed,
    linkId,
    scoreId,
    addOneToScoringLinkIds,
    removeOneFromScoringLinkIds,
    addScoreToCacheLinks,
    updateScoreInCacheLinks,
  ]);

  const businessProps = {
    "data-us3r-score-add-form": "",
    "data-authenticated": isAuthenticated || undefined,
    "data-scoring": isScoring || undefined,
    "data-disabled": isDisabled || undefined,
  };
  const contextValue = {
    value,
    setValue,
    text,
    setText,
    isScoring,
    isDisabled,
    errMsg,
    submitScore,
  };
  return (
    <form {...props} {...businessProps}>
      <ScoreFormContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <ScoreFormDefaultChildren />)}
      </ScoreFormContext.Provider>
    </form>
  );
}

export const ScoreForm = Object.assign(ScoreFormRoot, {
  ...ScoreFormElements,
});
