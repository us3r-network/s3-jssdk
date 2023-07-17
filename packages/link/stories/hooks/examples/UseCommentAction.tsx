import { useCommentAction } from "@us3r-network/link";
import { useState } from "react";

export default function ({ linkId }: { linkId: string }) {
  const { isCommenting, isDisabled, onComment } = useCommentAction(linkId, {
    onSuccessfullyComment: () => {
      console.log("Successfully commented");
    },
    onFailedComment: (errMsg) => {
      console.log("Failed to comment", errMsg);
    },
  });

  const [value, setValue] = useState("");

  return (
    <form
      aria-disabled={isDisabled}
      onSubmit={(e) => {
        e.preventDefault();
        onComment(value);
      }}
    >
      <input
        type="text"
        placeholder="Leave a comment..."
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
      <button type="submit">
        {isCommenting ? "Commenting..." : "Comment"}
      </button>
    </form>
  );
}
