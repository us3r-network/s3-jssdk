import { UserAvatar } from "@us3r-network/profile";
import ScoreForm from "./ScoreFormElements";

export function ScoreFormDefaultChildren() {
  return (
    <>
      <UserAvatar />
      <ScoreForm.ScoreSelectField />
      <ScoreForm.CommentTextarea />
      <ScoreForm.SubmitButton />
      <ScoreForm.ErrorMessage />
    </>
  );
}
