import { useLinkVotes } from "@us3r-network/link";
import { UserAvatar, UserName } from "@us3r-network/profile";

export default function ({ linkId }: { linkId: string }) {
  const { votes, votesCount, isFetching, isFetched, isFetchFailed, errMsg } =
    useLinkVotes(linkId);

  if (isFetching) return <p>Loading...</p>;
  if (isFetchFailed) return <p>{errMsg}</p>;

  return (
    <div>
      <p>Votes: {votesCount}</p>
      <table>
        <tr>
          <th>creator</th>
          <th>type</th>
          <th>createAt</th>
        </tr>
        {votes.map((vote) => (
          <tr key={vote.id}>
            <td>
              <UserAvatar did={vote?.creator?.id} />
              <UserName did={vote?.creator?.id} />
            </td>
            <td>{vote?.type}</td>
            <td>{vote?.createAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
