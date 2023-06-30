# Example

This project is a comprehensive example that demonstrates how to quickly develop a dapp using our SDK and components. 

In this example, we are creating a shared bookmark dapp. Users can create a link for a specific URL, see all links created by themselves or others, and can favor, vote, and comment on any link. 
 
 All this data is stored on Ceramic, which is a decentralized data network, and belongs to the user. No servers, databases, or any backend technologies are required.

> Prior knowledge of TypeScript, React, and GraphQL is helpful.


## PART I - Basic function with s3 jssdk
### [Step 0 Create React App](https://github.com/us3r-network/s3-jssdk/commit/007fc5a4622c708d43e64db0009049e36853b9a4).

Create a new React typescript project with [Create React App](https://create-react-app.dev/)

```bash
npx create-react-app link-collections --template typescript
```

We use [React Aria](https://react-spectrum.adobe.com/react-aria/react-aria-components.html) as our UI component library.

```javascript
yarn add react-aria-components
```

### [Step 1 auth](https://github.com/us3r-network/s3-jssdk/commit/ce0a69d05d201070323c38c1630c8bfc39854ab1).

As a Dapp using Ceramic ComposeDB, authentication is needed to enable mutations on data controlled by a user’s account.
You can use either @us3r-network/auth or @us3r-network/auth-with-rainbowkit to set up user authentication in your ComposeDB app.

```javascript
yarn add @us3r-network/auth-with-rainbowkit
```

Create components/AuthButton
```javascript
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useCallback } from "react";
import {Button} from 'react-aria-components'

export default function AuthButton() {
  const { ready, signIn, signOut } = useAuthentication();
  const session = useSession();

  const clickAction = useCallback(() => {
    if (session) {
      signOut();
    } else {
      signIn();
    }
  }, [session, signIn, signOut]);

  return (
    <Button isDisabled={!ready} onPress={clickAction}>
      {(() => {
        if (!ready) {
          return "Initializing session...";
        }
        return session ? "SignOut" : "SignIn";
      })()}
    </Button>
  );
}
```

Modify App.tsx
```javascript
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import './App.css'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <AuthButton />
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
```

### [Step 2 show link list](https://github.com/us3r-network/s3-jssdk/commit/98239ecd0ce64c1712246ff81ead56f1f6dd3ff8).

We now want to display a list of all link contents. To do this, we can use the @us3r-network/data-model library, which provides common operations such as reading, writing, and listing link data.

```javascript
yarn add @us3r-network/data-model
```

Create components/Links
```javascript
import { S3LinkModel, Link } from '@us3r-network/data-model'
import { useEffect, useState } from 'react'
import {
  Button,
  Cell,
  Column,
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

export default function Links () {
  const [links, setLinks] = useState<Link[]>([])

  const [queryParamsInfo, setQueryParamsInfo] = useState<Pagination>({
    last: PAGE_SIZE
  })
  const [pageInfo, setPageInfo] = useState<PageInfo>()
  const session = useSession()

  useEffect(() => {
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
  }, [session, queryParamsInfo])

  const prevPage = () => {
    setQueryParamsInfo({ first: PAGE_SIZE, after: pageInfo?.endCursor })
  }
  const nextPage = () => {
    setQueryParamsInfo({ last: PAGE_SIZE, before: pageInfo?.startCursor })
  }
  return (
    <div className='links'>
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
              <Cell aria-label='creator'>{link?.creator?.id}</Cell>
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

```

Create constants/index.ts
```javascript
export const CERAMIC_HOST =
  process.env.CERAMIC_HOST || 'https://gcp-ceramic-testnet-dev.s3.xyz'
```

Modify App.tsx
```javascript
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import './App.css'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <AuthButton />
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
```

### [Step 3 add create link](https://github.com/us3r-network/s3-jssdk/commit/b4d05feccc185d1ebe9fb2484b65532627967703).

Next, we need to add the function to create links.

Create components/CreateLink.tsx
```javascript
import { useSession } from '@us3r-network/auth-with-rainbowkit'
import { S3LinkModel } from '@us3r-network/data-model'
import { useState } from 'react'
import {
  Button,
  DialogTrigger,
  Modal,
  Dialog,
  Heading,
  TextField,
  Label,
  Input
} from 'react-aria-components'
import { CERAMIC_HOST } from '../constants'

const s3LinkModel = new S3LinkModel(CERAMIC_HOST)

export default function CreateLink () {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const session = useSession()

  return (
    <div className='createLink'>
      {session && (
        <DialogTrigger>
          <Button>Create New Link</Button>
          <Modal>
            <Dialog>
              {({ close }) => (
                <form>
                  <Heading>Create New Link</Heading>
                  <TextField autoFocus>
                    <Label>URL:</Label>
                    <Input
                      type='url'
                      value={url}
                      onChange={e => setUrl(e.target.value)}
                    />
                  </TextField>
                  <TextField>
                    <Label>Title:</Label>
                    <Input
                      type='text'
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </TextField>
                  <div className='create-link-buttons'>
                    <Button
                      onPress={() => {
                        close()
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onPress={() => {
                        if (!session) return
                        s3LinkModel.authComposeClient(session)
                        s3LinkModel.createLink({
                          title: title,
                          url: url,
                          type: 'example',
                          createAt: new Date().toISOString()
                        })
                        close()
                      }}
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      )}
    </div>
  )
}
```

Modify App.tsx
```javascript
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import './App.css'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <AuthButton />
      <Links />
      <CreateLink />
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
```

### [Step 4 add personal links](https://github.com/us3r-network/s3-jssdk/commit/72edd5d6e97ada51410bba958fe12b6bee036e7e).

On the link list page, add a list of links created by the user.

Modify components/Links.tsx
<https://github.com/us3r-network/s3-jssdk/commit/72edd5d6e97ada51410bba958fe12b6bee036e7e#diff-31074d88a6d6b6b8649e734b8466a2fc1a6dd8bc482a0ed1b6b083b9f935fc57>

### [Step 5 layout and styles](https://github.com/us3r-network/s3-jssdk/commit/5ce49fb9773e57f5f27a79619d39e4ce218d2f48).

we'll adjust the layout and style of the app to create a clean and visually appealing UI.

## PART II - More functions using s3 components
### [Step 6 use profile components](https://github.com/us3r-network/s3-jssdk/commit/fd6c2bc7db3c01689809aad0dc8dd116e9a3dee5).

To optimize creator user information in the user login and link list, consider using the @us3r-network/link library. It is a good choice.

```javascript
yarn add @us3r-network/profile
```

Modify App.tsx
```javascript
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import Links from './components/Links'
import './App.css'
import CreateLink from './components/CreateLink'
import { CERAMIC_HOST } from './constants'
import { ProfileStateProvider } from '@us3r-network/profile'
import { LinkStateProvider } from '@us3r-network/link'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
          <div className='app'>
            <AuthButton />
            <Links />
            <CreateLink />
          </div>
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
```

Modify components/AuthButton
<https://github.com/us3r-network/s3-jssdk/commit/fd6c2bc7db3c01689809aad0dc8dd116e9a3dee5#diff-7e5e87ce8ad39b84ca2d006e230400820c35872f5de8633d3a6bd6948446aca1>

Modify components/Links.tsx
<https://github.com/us3r-network/s3-jssdk/commit/fd6c2bc7db3c01689809aad0dc8dd116e9a3dee5#diff-31074d88a6d6b6b8649e734b8466a2fc1a6dd8bc482a0ed1b6b083b9f935fc57>
### [Step 7 use link component to favor](https://github.com/us3r-network/s3-jssdk/commit/42ec1614680421018c0e6c85293bfa521c429717).

We also need to add the functions of bookmarking, voting, and commenting to each link. We can use the pre-existing components in @us3r-network/link.

```javascript
yarn add @us3r-network/link
```

Modify App.tsx
```javascript
import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import Links from './components/Links'
import './App.css'
import CreateLink from './components/CreateLink'
import { CERAMIC_HOST } from './constants'
import { ProfileStateProvider } from '@us3r-network/profile'
import { LinkStateProvider } from '@us3r-network/link'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
        <LinkStateProvider ceramicHost={CERAMIC_HOST}>
          <div className='app'>
            <AuthButton />
            <Links />
            <CreateLink />
          </div>
        </LinkStateProvider>
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
```


Modify components/Links.tsx
<https://github.com/us3r-network/s3-jssdk/commit/42ec1614680421018c0e6c85293bfa521c429717#diff-31074d88a6d6b6b8649e734b8466a2fc1a6dd8bc482a0ed1b6b083b9f935fc57>