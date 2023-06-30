import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import Links from './components/Links'
import './App.css'
import CreateLink from './components/CreateLink'
import { CERAMIC_HOST } from './constants'
import { ProfileStateProvider } from '@us3r-network/profile'

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
