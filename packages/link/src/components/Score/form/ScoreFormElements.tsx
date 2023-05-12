import { Button, ButtonProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useScoreFormState } from "./ScoreFormContext";
import { TextArea, TextAreaProps } from "../../common/TextArea";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";

type ScoreFieldRenderProps = {
  value: number;
  setValue: (value: number) => void;
  isDisabled: boolean;
};
export function ScoreField({
  children,
  ...props
}: ChildrenRenderProps<HTMLAttributes<HTMLDivElement>, ScoreFieldRenderProps>) {
  const { value, setValue, isDisabled } = useScoreFormState();
  const renderProps = {
    value,
    setValue,
    isDisabled,
  };
  return (
    <div data-score-value="" {...props}>
      {childrenRender(
        children,
        renderProps,
        <RatingStarSelect
          value={value}
          onChange={setValue}
          isDisabled={isDisabled}
        />
      )}
    </div>
  );
}

export function CommentTextarea(props: TextAreaProps) {
  const { text, setText, isDisabled } = useScoreFormState();
  return (
    <TextArea
      data-score-text=""
      disabled={isDisabled}
      placeholder="Comment"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      {...props}
    />
  );
}

export function SubmitButton(props: ButtonProps) {
  const { isDisabled, submitScore } = useScoreFormState();
  return (
    <Button
      data-submit-button=""
      onPress={submitScore}
      isDisabled={isDisabled}
      {...props}
    />
  );
}

export function ErrorMessage({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  {
    scoresAvg: number;
  }
>) {
  const { errMsg } = useScoreFormState();
  return (
    <div data-error-message="" {...props}>
      {childrenRender(children, { errMsg }, errMsg)}
    </div>
  );
}
