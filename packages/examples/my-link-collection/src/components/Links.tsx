import { S3LinkModel, Link } from '@us3r-network/data-model'
import { useEffect, useState } from 'react'
import { GridList, Item, Switch } from 'react-aria-components'
import { CERAMIC_HOST } from '../constants'
import { UserAvatar, UserName } from '@us3r-network/profile'
import { FavorButton, VoteButton } from '@us3r-network/link'
import { useSession } from '@us3r-network/auth-with-rainbowkit'

const s3LinkModel = new S3LinkModel(CERAMIC_HOST)

export default function Links () {
  const [links, setLinks] = useState<Link[]>([])
  const [showFavorOnly, setShowFavorOnly] = useState<Boolean>(false)
  const session = useSession()
  
  useEffect(() => {
    if (showFavorOnly) {
      if (!session) return
      s3LinkModel.authComposeClient(session)
      s3LinkModel.queryPersonalLinksDesc({ last: 20 }).then(res => {
        const resLinks =
          res.data?.viewer?.linkList?.edges
            ?.filter(edge => !!edge?.node)
            .map(edge => edge?.node) || []
        setLinks(resLinks.reverse())
      })
    } else {
      s3LinkModel.queryLinksDesc({ last: 20 }).then(res => {
        const resLinks =
          res.data?.linkIndex?.edges
            ?.filter(edge => !!edge?.node)
            .map(edge => edge?.node) || []
        setLinks(resLinks.reverse())
      })
    }
  }, [session, showFavorOnly])

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
    <>
      <Switch onChange={setShowFavorOnly}>
        {showFavorOnly? 'Show All Links': 'Show Favor Links Only'}
      </Switch>
      <GridList aria-label='links' selectionMode='none'>
        {links.map(link => (
          <Item key={link?.id} textValue={link?.url}>
            <a href={link?.url} target='_blank' rel='noreferrer'>
              {link?.title}
            </a>
            <div aria-label='creator'>
              <UserAvatar did={link?.creator?.id} />
              <UserName did={link?.creator?.id} />
            </div>
            <span aria-label='createAt'>{link?.createAt}</span>

            <div aria-label='user-actions'>
              <FavorButton linkId={link.id!} />
            </div>
          </Item>
        ))}
      </GridList>
    </>
  )
}
