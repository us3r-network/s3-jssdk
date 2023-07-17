import { useLinkState, getS3LinkModel } from "@us3r-network/link";

export default function () {
  const { s3LinkModalInitialed, s3LinkModalAuthed } = useLinkState();
  const s3LinkModel = getS3LinkModel();

  const queryLink = async (linkId: string) => {
    if (!s3LinkModalInitialed) {
      throw Error("s3LinkModel is not initialed");
    }
    return await s3LinkModel?.queryLink(linkId);
  };

  const queryPersonalLinks = async () => {
    if (!s3LinkModalAuthed) {
      throw Error("s3LinkModel is not authed");
    }
    return await s3LinkModel?.queryPersonalLinks({
      first: 1000,
    });
  };

  return { queryLink, queryPersonalLinks };
}
