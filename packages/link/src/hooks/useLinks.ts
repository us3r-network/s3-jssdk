import { useEffect, useMemo } from "react";
import { Page } from "@ceramicnetwork/common";
import { Favor, Link } from "@us3r-network/data-model";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const useLinks = () => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const getLinkId = async (link:Link) => {
    if (!s3LinkModel || !s3LinkModalInitialed) return "";
    const filters = {
      "where" : {
        "url" : { 
          "equalTo" : link.url
        },
        "type" : { 
          "equalTo" : link.type
        }
      },
    };
    const resp = await s3LinkModel?.queryLinks(
      { 
        filters
      }
    );
    const links = resp?.data?.linkIndex?.edges;
    if (links && links.length > 0) {
      return links[0].node.id;
    }
    return "";
  };

  return { getLinkId };
};
