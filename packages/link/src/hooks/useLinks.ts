/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-12 16:52:40
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 16:45:53
 * @FilePath: /s3-jssdk/packages/link/src/hooks/useLinks.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useState } from "react";
import { Link } from "@us3r-network/data-model";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";

export const useLinks = (link:Link|undefined) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();
  const [linkId, setLinkId] = useState<string>('');

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

  useEffect(() => {
    if (link && link.url && link.type) {
      getLinkId(link).then((id) => {
        if(id) setLinkId(id)
        else setLinkId('');
      });
    }
  }, [link?.url]);

  return { getLinkId, setLinkId, linkId };
};
