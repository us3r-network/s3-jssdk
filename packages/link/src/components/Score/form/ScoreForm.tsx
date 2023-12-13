/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 17:17:11
 * @FilePath: /s3-jssdk/packages/link/src/components/Score/form/ScoreForm.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import ScoreFormElements from "./ScoreFormElements";
import { ScoreFormContext, ScoreFormContextValue } from "./ScoreFormContext";
import { ScoreFormDefaultChildren } from "./ScoreFormDefaultChildren";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { useScoreAction } from "../../../hooks/useScoreAction";
import { useLinkScores } from "../../../hooks/useLinkScores";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../../hooks/useLinks";
export interface ScoreFormIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
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
  link,
  scoreId,
  children,
  onSuccessfullyScore,
  onFailedScore,
  ...props
}: ScoreFormProps) {
  const isAuthenticated = useIsAuthenticated();
  const {linkId:unknownLinkId} = useLinks(link);
  const { scores } = useLinkScores(linkId||unknownLinkId);
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
    link,
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
