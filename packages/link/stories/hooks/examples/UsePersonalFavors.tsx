import { usePersonalFavors } from "@us3r-network/link";

export default function () {
  const { isFetching, personalFavors } = usePersonalFavors();

  if (isFetching) return <p>Loading...</p>;

  return (
    <div>
      <table>
        <tr>
          <th>link type</th>
          <th>link url</th>
          <th>createAt</th>
        </tr>
        {personalFavors.map((favor) => (
          <tr key={favor.id}>
            <td>{favor?.link?.type}</td>
            <td>{favor?.link?.url}</td>
            <td>{favor?.createAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
