import { UserAvatar } from "@us3r-network/profile";
import * as ScoreForm from "./ScoreFormElements";

export function ScoreFormDefaultChildren() {
  return (
    <>
      <UserAvatar />
      <ScoreForm.ScoreSelectField />
      <ScoreForm.CommentTextarea />
      <ScoreForm.SubmitButton>Submit</ScoreForm.SubmitButton>
      <ScoreForm.ErrorMessage />
    </>
  );
}
