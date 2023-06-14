import {
  Button,
  ButtonRenderProps,
  Input,
  InputProps,
} from "react-aria-components";
import { HTMLAttributes } from "react";
import { useCommentAddFormState } from "./CommentAddFormContext";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import { AriaButtonProps } from "react-aria";
import LoadingSpokes from "../../common/Loading/LoadingSpokes";

function TextInput(props: InputProps) {
  const { text, setText, isDisabled } = useCommentAddFormState();
  return (
    <Input
      data-state-element="TextInput"
      disabled={isDisabled}
      placeholder="text"
      value={text}
      onChange={(e) => {
        setText(e.target.value);
      }}
      {...props}
    />
  );
}

function SubmitButton({
  children,
  ...props
}: ChildrenRenderProps<
  AriaButtonProps,
  ButtonRenderProps & {
    isCommenting: boolean;
  }
>) {
  const { isDisabled, isCommenting, submitComment } = useCommentAddFormState();
  return (
    <Button
      data-state-element="SubmitButton"
      onPress={submitComment}
      isDisabled={isDisabled}
      {...props}
    >
      {(buttonProps) =>
        childrenRender(
          children,
          { ...buttonProps, isCommenting },
          isCommenting ? <LoadingSpokes /> : "Submit"
        )
      }
    </Button>
  );
}

function ErrorMessage({
  children,
  ...props
}: ChildrenRenderProps<
  HTMLAttributes<HTMLSpanElement>,
  {
    errMsg: string;
  }
>) {
  const { errMsg } = useCommentAddFormState();
  return (
    <span data-state-element="ErrorMessage" {...props}>
      {childrenRender(children, { errMsg }, errMsg)}
    </span>
  );
}

export default {
  TextInput,
  SubmitButton,
  ErrorMessage,
};
