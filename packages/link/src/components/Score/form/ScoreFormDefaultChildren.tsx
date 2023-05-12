import * as ScoreForm from "./ScoreFormElements";

export function ScoreFormDefaultChildren() {
  return (
    <>
      <section>
        <ScoreForm.ScoreSelect />
      </section>
      <section>
        <ScoreForm.CommentTextarea />
      </section>
      <section>
        <ScoreForm.SubmitButton>Submit</ScoreForm.SubmitButton>
      </section>

      <ScoreForm.ErrorMessage />
    </>
  );
}
