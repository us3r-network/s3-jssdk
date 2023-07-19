import { useVoteAction } from "@us3r-network/link";

export default function ({ linkId }: { linkId: string }) {
  const { isVoted, isVoting, isDisabled, onVote } = useVoteAction(linkId, {
    onSuccessfullyVote: (isVoted) => {
      if (isVoted) {
        console.log("Successfully voted");
      } else {
        console.log("Successfully unvoted");
      }
    },
    onFailedVote: (errMsg) => {
      console.log("Failed to vote", errMsg);
    },
  });

  return (
    <button disabled={isDisabled} onClick={onVote}>
      {(() => {
        if (isVoting) return "Voting...";
        if (isVoted) return "Voted";
        return "Vote";
      })()}
    </button>
  );
}
