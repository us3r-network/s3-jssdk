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
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { useScoreAction } from "../../../hooks/useScoreAction";
import { useScores } from "../../../hooks/useScores";

export interface ScoreFormIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * score stream id.
   * if provided, the form will be in edit mode
   * if not provided, the form will be in add mode
   */
  scoreId?: string;
  /**
   * callback when score is successfully added
   */
  onSuccessfullyScore?: () => void;
  /**
   * callback when score is failed to add
   */
  onFailedScore?: (errMsg: string) => void;
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
  onSuccessfullyScore,
  onFailedScore,
  ...props
}: ScoreFormProps) {
  const isAuthenticated = useIsAuthenticated();
  const { scores } = useScores(linkId);
  const score = useMemo(
    () => (scoreId ? scores.find((s) => s.id === scoreId) : null),
    [scores, scoreId]
  );

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

  const { isScoring, isDisabled, onScoreAdd, onScoreEdit } = useScoreAction(
    linkId,
    {
      onSuccessfullyScore,
      onFailedScore: (errMsg) => {
        setErrMsg(errMsg);
        onFailedScore?.(errMsg);
      },
    }
  );

  const submitScore = useCallback(async () => {
    if (scoreId) {
      await onScoreEdit({ scoreId, value, text });
    } else {
      await onScoreAdd({ value, text });
    }
  }, [scoreId, value, text, onScoreAdd, onScoreEdit]);

  const businessProps = {
    "data-us3r-component": "ScoreForm",
    "data-form-type": scoreId ? "edit" : "add",
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
    <form {...businessProps} {...props}>
      <ScoreFormContext.Provider value={contextValue}>
        {childrenRender(children, contextValue, <ScoreFormDefaultChildren />)}
      </ScoreFormContext.Provider>
    </form>
  );
}

export const ScoreForm = Object.assign(ScoreFormRoot, {
  ...ScoreFormElements,
});
