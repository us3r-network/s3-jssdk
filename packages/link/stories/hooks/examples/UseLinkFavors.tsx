import { useLinkFavors } from "@us3r-network/link";
import { UserAvatar, UserName } from "@us3r-network/profile";

export default function ({ linkId }: { linkId: string }) {
  const { favors, favorsCount, isFetching, isFetched, isFetchFailed, errMsg } =
    useLinkFavors(linkId);

  if (isFetching) return <p>Loading...</p>;
  if (isFetchFailed) return <p>{errMsg}</p>;

  return (
    <div>
      <p>Favors: {favorsCount}</p>
      <table>
        <tr>
          <th>creator</th>
          <th>createAt</th>
        </tr>
        {favors.map((favor) => (
          <tr key={favor.id}>
            <td>
              <UserAvatar did={favor?.creator?.id} />
              <UserName did={favor?.creator?.id} />
            </td>
            <td>{favor?.createAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
