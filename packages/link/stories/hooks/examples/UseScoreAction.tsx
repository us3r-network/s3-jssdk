import { useScoreAction } from "@us3r-network/link";
import { useState } from "react";

export default function ({
  linkId,
  scoreId,
}: {
  linkId: string;
  scoreId?: string;
}) {
  const { isScored, isScoring, isDisabled, onScoreAdd, onScoreEdit } =
    useScoreAction(linkId, {
      onSuccessfullyScore: () => {
        console.log("Successfully scored");
      },
      onFailedScore: (errMsg) => {
        console.log("Failed to score", errMsg);
      },
    });

  const [value, setValue] = useState(0);
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (isScored && scoreId) {
          onScoreEdit({ value, text, scoreId });
        } else {
          onScoreAdd({ value, text });
        }
      }}
    >
      <input
        type="number"
        placeholder="Score"
        disabled={isDisabled}
        onChange={(e) => {
          setValue(parseInt(e.target.value));
        }}
      />
      <input
        type="text"
        placeholder="Comment"
        disabled={isDisabled}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <button type="submit" disabled={isDisabled}>
        {isScoring ? "Scoring..." : "Score"}
      </button>
    </form>
  );
}
