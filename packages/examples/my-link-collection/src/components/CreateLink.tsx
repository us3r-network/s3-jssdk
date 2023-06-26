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

const CERAMIC_HOST =
  process.env.CERAMIC_HOST || 'https://gcp-ceramic-testnet-dev.s3.xyz'

const s3LinkModel = new S3LinkModel(CERAMIC_HOST)

export default function Links () {
  const [title, setTitle] = useState('')
  const [url, setUrl] = useState('')
  const session = useSession()

  return (
    <>
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
                </form>
              )}
            </Dialog>
          </Modal>
        </DialogTrigger>
      )}
    </>
  )
}
