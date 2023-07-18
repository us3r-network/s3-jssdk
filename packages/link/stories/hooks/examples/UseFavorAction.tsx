import { useFavorAction } from "@us3r-network/link";

export default function ({ linkId }: { linkId: string }) {
  const { isFavored, isFavoring, isDisabled, onFavor } = useFavorAction(
    linkId,
    {
      onSuccessfullyFavor: (isFavored) => {
        if (isFavored) {
          console.log("Successfully favored");
        } else {
          console.log("Successfully unfavored");
        }
      },
      onFailedFavor: (errMsg) => {
        console.log("Failed to favor", errMsg);
      },
    }
  );

  return (
    <button disabled={isDisabled} onClick={onFavor}>
      {(() => {
        if (isFavoring) return "Favoring...";
        if (isFavored) return "Favored";
        return "Favor";
      })()}
    </button>
  );
}
