import { S3LinkModel, Link } from '@us3r-network/data-model'
import { useEffect, useState } from 'react'
import {
  Button,
  Cell,
  Column,
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
      </RadioGroup>
      <Table aria-label='Links' selectionMode='multiple'>
        <TableHeader>
          <Column isRowHeader>Link</Column>
          <Column>Creator</Column>
          <Column>Date</Column>
        </TableHeader>
        <TableBody>
          {links.map(link => (
            <Row key={link?.id} textValue={link?.url}>
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
