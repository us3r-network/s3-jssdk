import { usePersonalScores } from "@us3r-network/link";

export default function () {
  const { isFetching, personalScores } = usePersonalScores();

  if (isFetching) return <p>Loading...</p>;

  return (
    <div>
      <table>
        <tr>
          <th>link type</th>
          <th>link url</th>
          <th>score value</th>
          <th>score text</th>
          <th>createAt</th>
        </tr>
        {personalScores.map((score) => (
          <tr key={score.id}>
            <td>{score?.link?.type}</td>
            <td>{score?.link?.url}</td>
            <td>{score?.value}</td>
            <td>{score?.text}</td>
            <td>{score?.createAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
