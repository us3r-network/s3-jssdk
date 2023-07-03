import { useSession } from '@us3r-network/auth-with-rainbowkit'
import {
  LoginButton,
  LogoutButton,
  UserInfo
} from '@us3r-network/profile'
import {
  DialogTrigger,
  Popover,
  Dialog,
  OverlayArrow
} from 'react-aria-components'

export default function AuthButton () {
  const session = useSession()

  return (
    <DialogTrigger>
      <LoginButton />
      {session && (
        <Popover placement='start'>
          <OverlayArrow>
            <svg width={12} height={12}>
              <path d='M0 0,L6 6,L12 0' />
            </svg>
          </OverlayArrow>
          <Dialog>
            <UserInfo />
            <LogoutButton />
          </Dialog>
        </Popover>
      )}
    </DialogTrigger>
  )
}
