import { useLinkScores } from "@us3r-network/link";
import { UserAvatar, UserName } from "@us3r-network/profile";

export default function ({ linkId }: { linkId: string }) {
  const { scores, scoresCount, isFetching, isFetched, isFetchFailed, errMsg } =
    useLinkScores(linkId);

  if (isFetching) return <p>Loading...</p>;
  if (isFetchFailed) return <p>{errMsg}</p>;

  return (
    <div>
      <p>Scores: {scoresCount}</p>
      <table>
        <tr>
          <th>creator</th>
          <th>value</th>
          <th>text</th>
          <th>createAt</th>
        </tr>
        {scores.map((score) => (
          <tr key={score.id}>
            <td>
              <UserAvatar did={score?.creator?.id} />
              <UserName did={score?.creator?.id} />
            </td>
            <td>{score?.value}</td>
            <td>{score?.text}</td>
            <td>{score?.createAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
