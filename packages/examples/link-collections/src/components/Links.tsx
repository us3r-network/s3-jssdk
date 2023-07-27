import { S3LinkModel, Link } from '@us3r-network/data-model'
import { useEffect, useState } from 'react'
import {
  Button,
  Cell,
  Column,
  Dialog,
  DialogTrigger,
  OverlayArrow,
  Popover,
  Radio,
  RadioGroup,
  Row,
  Table,
  TableBody,
  TableHeader
} from 'react-aria-components'
import { CERAMIC_HOST } from '../constants'
import { useSession } from '@us3r-network/auth-with-rainbowkit'
import type {
  PageInfo,
  Pagination,
  ForwardPagination,
  BackwardPagination
} from '@ceramicnetwork/common'
import { UserAvatar, UserName } from '@us3r-network/profile'
import {
  CommentAddForm,
  Comments,
  FavorButton,
  VoteButton
} from '@us3r-network/link'
import { ReactComponent as MessageIcon } from '@material-design-icons/svg/outlined/message.svg'

const s3LinkModel = new S3LinkModel(CERAMIC_HOST)
const PAGE_SIZE = 20

export enum PaginationKind {
  FORWARD,
  BACKWARD
}

// pagination type gateway
export function parsePagination (query: Pagination): PaginationKind | undefined {
  if ('first' in query && 'after' in query) {
    console.log('forward')
    return PaginationKind.FORWARD
  } else if ('last' in query && 'before' in query) {
    console.log('backward')
    return PaginationKind.BACKWARD
  }
}

enum ListType {
  ALL = 'all',
  FAVOR = 'favor',
  PERSONAL = 'personal'
}

// remove duplicate form array based on filed
const unique = (arr: any[], filed: string) => {
  const res = new Map()
  return arr.filter(item => !res.has(item[filed]) && res.set(item[filed], 1))
}

const shortStreamID = (id: string | undefined, len = 4) => {
  if (id) {
    return id.slice(0, len) + "..".repeat(len / 4) + id.slice(-len);
  }
  return ''
}

export default function Links () {
  const [links, setLinks] = useState<Link[]>([])

  const [queryParamsInfo, setQueryParamsInfo] = useState<Pagination>({
    last: PAGE_SIZE
  })
  const [pageInfo, setPageInfo] = useState<PageInfo>()
  const session = useSession()

  const [selectedListType, setSelectedListType] = useState('all')

  useEffect(() => {
    switch (selectedListType) {
      case ListType.ALL:
        //all links
        if (parsePagination(queryParamsInfo) === PaginationKind.FORWARD) {
          //prev page
          s3LinkModel
            .queryLinks(queryParamsInfo as ForwardPagination)
            .then(res => {
              const resLinks =
                res.data?.linkIndex?.edges
                  ?.filter(edge => !!edge?.node)
                  .map(edge => edge?.node) || []
              setLinks(resLinks.reverse())
              setPageInfo(res.data?.linkIndex?.pageInfo)
            })
        } else {
          //next page
          s3LinkModel
            .queryLinksDesc(queryParamsInfo as BackwardPagination)
            .then(res => {
              const resLinks =
                res.data?.linkIndex?.edges
                  ?.filter(edge => !!edge?.node)
                  .map(edge => edge?.node) || []
              setLinks(resLinks.reverse())
              setPageInfo(res.data?.linkIndex?.pageInfo)
            })
        }
        break
      case ListType.PERSONAL:
        //personal links
        if (!session) return
        s3LinkModel.authComposeClient(session)
        if (parsePagination(queryParamsInfo) === PaginationKind.FORWARD) {
          //prev page
          s3LinkModel
            .queryPersonalLinks(queryParamsInfo as ForwardPagination)
            .then(res => {
              const resLinks =
                res.data?.viewer?.linkList?.edges
                  ?.filter(edge => !!edge?.node)
                  .map(edge => edge?.node) || []
              setLinks(resLinks.reverse())
              setPageInfo(res.data?.viewer?.linkList?.pageInfo)
            })
        } else {
          //next page
          s3LinkModel
            .queryPersonalLinksDesc(queryParamsInfo as BackwardPagination)
            .then(res => {
              const resLinks =
                res.data?.viewer?.linkList?.edges
                  ?.filter(edge => !!edge?.node)
                  .map(edge => edge?.node) || []
              setLinks(resLinks.reverse())
              setPageInfo(res.data?.viewer?.linkList?.pageInfo)
            })
        }
        break
      case ListType.FAVOR:
        //favor links
        if (!session) return
        s3LinkModel.authComposeClient(session)
        if (parsePagination(queryParamsInfo) === PaginationKind.FORWARD) {
          //prev page
          s3LinkModel
            .queryPersonalFavors(queryParamsInfo as ForwardPagination)
            .then(res => {
              const resLinks =
                res.data?.viewer?.favorList?.edges
                  ?.filter(
                    edge =>
                      !!edge?.node && !!edge?.node?.link && !edge?.node?.revoke
                  )
                  .map(edge => edge?.node?.link!) || []
              setLinks(unique(resLinks.reverse(), 'id'))
              setPageInfo(res.data?.viewer?.favorList?.pageInfo)
            })
        } else {
          //next page
          s3LinkModel
            .queryPersonalFavorsDesc(queryParamsInfo as BackwardPagination) //todo should be desc
            .then(res => {
              const resLinks =
                res.data?.viewer?.favorList?.edges
                  ?.filter(
                    edge =>
                      !!edge?.node && !!edge?.node?.link && !edge?.node?.revoke
                  )
                  .map(edge => edge?.node?.link!) || []
              setLinks(unique(resLinks.reverse(), 'id'))
              console.log(resLinks)
              setPageInfo(res.data?.viewer?.favorList?.pageInfo)
            })
        }
        break
    }
  }, [session, queryParamsInfo, selectedListType])

  const prevPage = () => {
    setQueryParamsInfo({ first: PAGE_SIZE, after: pageInfo?.endCursor })
  }
  const nextPage = () => {
    setQueryParamsInfo({ last: PAGE_SIZE, before: pageInfo?.startCursor })
  }
  return (
    <div className='links'>
      <RadioGroup value={selectedListType} onChange={setSelectedListType}>
        <Radio value={ListType.ALL}>{ListType.ALL}</Radio>
        <Radio value={ListType.PERSONAL} isDisabled={!session}>
          {ListType.PERSONAL}
        </Radio>
        <Radio value={ListType.FAVOR} isDisabled={!session}>
          {ListType.FAVOR}
        </Radio>
      </RadioGroup>
      <Table aria-label='Links' selectionMode='multiple'>
        <TableHeader>
          <Column>Favor</Column>
          <Column>Vote</Column>
          <Column>Comment</Column>
          <Column isRowHeader>Link</Column>
          <Column>Creator</Column>
          <Column>Date</Column>
          <Column>Stream</Column>
        </TableHeader>
        <TableBody>
          {links.map(link => (
            <Row key={link?.id} textValue={link?.url}>
              <Cell aria-label='user-actions-favor'>
                <FavorButton linkId={link.id!} />
              </Cell>
              <Cell aria-label='user-actions-vote'>
                <VoteButton linkId={link.id!} />
              </Cell>
              <Cell aria-label='user-actions-vote'>
                <Comments linkId={link.id!} className='link-comments'>
                  <DialogTrigger>
                    <Button className='link-comments-number-button'>
                      <MessageIcon />
                      <Comments.Count />
                    </Button>
                    {session && (
                      <Popover placement='end'>
                        <OverlayArrow>
                          <svg width={12} height={12}>
                            <path d='M0 0,L6 6,L12 0' />
                          </svg>
                        </OverlayArrow>
                        <Dialog className='link-comments-dialog'>
                          <CommentAddForm
                            linkId={link.id!}
                            className='link-comments-form'
                          />
                          <Comments.List className='link-comments-list'>
                            {item => (
                              <Comments.Item
                                value={item}
                                key={item.id}
                                className='link-comments-item'
                              >
                                <div className='item-divide-line' />
                                <div className='item-contents'>
                                  <Comments.Avatar />
                                  <div className='link-comments-contents'>
                                    <div className='link-comments-meta'>
                                      <Comments.Name className='link-comments-creator' />
                                      <Comments.CreateAt className='link-comments-time' />
                                    </div>
                                    <Comments.Text className='link-comments-text' />
                                  </div>
                                </div>
                              </Comments.Item>
                            )}
                          </Comments.List>
                        </Dialog>
                      </Popover>
                    )}
                  </DialogTrigger>
                </Comments>
              </Cell>
              <Cell>
                <a href={link?.url} target='_blank' rel='noreferrer'>
                  {link?.title}
                </a>
              </Cell>
              <Cell aria-label='creator'>
                <UserAvatar did={link?.creator?.id} />
                <UserName did={link?.creator?.id} />
              </Cell>
              <Cell aria-label='createAt'>{link?.createAt}</Cell>
              <Cell>
                <a href={`https://scan.s3.xyz/streams/stream/${link?.id}`} target='_blank' rel='noreferrer'>
                  {shortStreamID(link?.id)}
                </a>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </Table>
      <div>
        {/* when query backward, hasNextPage is always false */}
        <Button
          isDisabled={
            !(
              pageInfo?.hasNextPage ||
              parsePagination(queryParamsInfo) === PaginationKind.BACKWARD
            )
          }
          onPress={prevPage}
        >
          Prev Page
        </Button>
        {/* when query forward, hasPreviousPage is always false */}
        <Button
          isDisabled={
            !(
              pageInfo?.hasPreviousPage ||
              parsePagination(queryParamsInfo) === PaginationKind.FORWARD
            )
          }
          onPress={nextPage}
        >
          Next Page
        </Button>
      </div>
    </div>
  )
}
