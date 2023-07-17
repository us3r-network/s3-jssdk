import { useLinkComments } from "@us3r-network/link";
import { UserAvatar, UserName } from "@us3r-network/profile";

export default function ({ linkId }: { linkId: string }) {
  const {
    comments,
    commentsCount,
    isFetching,
    isFetched,
    isFetchFailed,
    errMsg,
  } = useLinkComments(linkId);

  if (isFetching) return <p>Loading...</p>;
  if (isFetchFailed) return <p>{errMsg}</p>;

  return (
    <div>
      <p>Comments: {commentsCount}</p>
      <table>
        <tr>
          <th>creator</th>
          <th>text</th>
          <th>createAt</th>
        </tr>
        {comments.map((comment) => (
          <tr key={comment.id}>
            <td>
              <UserAvatar did={comment?.creator?.id} />
              <UserName did={comment?.creator?.id} />
            </td>
            <td>{comment?.text}</td>
            <td>{comment?.createAt}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
