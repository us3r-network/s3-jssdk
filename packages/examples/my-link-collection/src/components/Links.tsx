import { S3LinkModel, Link } from '@us3r-network/data-model'
import { useEffect, useState } from 'react'
import { GridList, Item } from 'react-aria-components'
import { CERAMIC_HOST } from '../constants'
import { UserAvatar, UserName } from '@us3r-network/profile'

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
          <a href={link?.url} target='_blank' rel='noreferrer'>
            {link?.title}
          </a>
          <div aria-label='creator'>
            <UserAvatar did={link?.creator?.id} />
            <UserName did={link?.creator?.id} />
          </div>
          <span aria-label='createAt'>{link?.createAt}</span>
        </Item>
      ))}
    </GridList>
  )
}
