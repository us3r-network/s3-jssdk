import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import SignButton from './components/SignButton'
import Links from './components/Links'
import CreateLink from './components/CreateLink'
import { ProfileStateProvider } from '@us3r-network/profile'
import { CERAMIC_HOST } from './constants'

import './App.css'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
    <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
      <SignButton />
      <Links/>
      <CreateLink />
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
