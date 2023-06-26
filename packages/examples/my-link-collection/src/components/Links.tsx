import { S3LinkModel, Link } from '@us3r-network/data-model'
import { useEffect, useState } from 'react'
import { GridList, Item } from 'react-aria-components'
const CERAMIC_HOST =
  process.env.CERAMIC_HOST || 'https://gcp-ceramic-testnet-dev.s3.xyz'

const s3LinkModel = new S3LinkModel(CERAMIC_HOST)

export default function Links () {
  const [links, setLinks] = useState<Link[]>([])

  useEffect(() => {
    s3LinkModel.queryLinksDesc({ last: 20 }).then(res => {
      const resLinks =
        res.data?.linkIndex?.edges
          ?.filter(edge => !!edge?.node)
          .map(edge => edge?.node) || []
      console.log('links: ', res, resLinks)
      setLinks(resLinks)
    })
  }, [])

  return (
    // <>
    //   {links.map(link => {
    //     return (
    //       <p key={link.id}>
    //         <a href={link?.url}>{link?.title}</a>
    //         <span>{link?.createAt}</span>
    //       </p>
    //     )
    //   })}
    // </>

    <GridList aria-label='Links' selectionMode='none'>
      {links.map(link => (
        <Item textValue={link?.url}>
          <a href={link?.url} target="_blank" rel="noreferrer">{link?.title}</a>
          <span aria-label='creator'>{link?.creator?.id}</span>
          <span aria-label='createAt'>{link?.createAt}</span>
        </Item>
      ))}
    </GridList>
  )
}
