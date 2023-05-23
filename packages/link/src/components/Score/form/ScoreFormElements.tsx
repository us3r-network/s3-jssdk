import { Button, ButtonProps, ButtonRenderProps } from "react-aria-components";
import { HTMLAttributes } from "react";
import { useScoreFormState } from "./ScoreFormContext";
import { TextArea, TextAreaProps } from "../../common/TextArea";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import RatingStarSelect from "../../common/RatingStar/RatingStarSelect";
import { AriaButtonProps } from "react-aria";
import LoadingSpokes from "../../common/Loading/LoadingSpokes";

type ScoreSelectFieldRenderProps = {
  value: number;
  setValue: (value: number) => void;
  isDisabled: boolean;
};
export function ScoreSelectField({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLDivElement>,
  ScoreSelectFieldRenderProps
>) {
  const { value, setValue, isDisabled } = useScoreFormState();
  const renderProps = {
    value,
    setValue,
    isDisabled,
  };
  return (
    <div data-state-element="ScoreSelectField" {...props}>
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

export function SubmitButton({
  children,
  ...props
}: ChildrenRenderProps<
  AriaButtonProps,
  ButtonRenderProps & {
    isScoring: boolean;
  }
>) {
  const { isDisabled, isScoring, submitScore } = useScoreFormState();
  return (
    <Button
      data-state-element="SubmitButton"
      onPress={submitScore}
      isDisabled={isDisabled}
      {...props}
    >
      {(buttonProps) =>
        childrenRender(
          children,
          { ...buttonProps, isScoring },
          isScoring ? <LoadingSpokes /> : "Submit"
        )
      }
    </Button>
  );
}

export function ErrorMessage({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    errMsg: string;
  }
>) {
  const { errMsg } = useScoreFormState();
  return (
    <span data-state-element="ErrorMessage" {...props}>
      {childrenRender(children, { errMsg }, errMsg)}
    </span>
  );
}
