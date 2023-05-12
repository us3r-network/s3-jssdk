import { Button, ButtonProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useScoreFormState } from "./ScoreFormContext";
import { TextArea, TextAreaProps } from "../../common/TextArea";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";

type ScoreSelectRenderProps = {
  value: number;
  setValue: (value: number) => void;
  isDisabled: boolean;
};
export function ScoreSelect({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  ScoreSelectRenderProps
>) {
  const { value, setValue, isDisabled } = useScoreFormState();
  const renderProps = {
    value,
    setValue,
    isDisabled,
  };
  return (
    <div data-state-element="ScoreSelect" {...props}>
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
      data-state-element="CommentTextarea"
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

export function ErrorMessage(props: HTMLAttributes<HTMLSpanElement>) {
  const { errMsg } = useScoreFormState();
  return (
    <span data-state-element="ErrorMessage" {...props}>
      {errMsg}
    </span>
  );
}
