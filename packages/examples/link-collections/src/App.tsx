import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'
import AuthButton from './components/AuthButton'
import Links from './components/Links'
import './App.css'
import CreateLink from './components/CreateLink'
import { CERAMIC_HOST } from './constants'
import { ProfileStateProvider } from '@us3r-network/profile'
import { LinkStateProvider } from '@us3r-network/link'

import GitHubButton from 'react-github-btn'

function App () {
  return (
    <>
      <Us3rAuthWithRainbowkitProvider>
        <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
          <LinkStateProvider ceramicHost={CERAMIC_HOST}>
            <div className='app'>
              <div className='header'>
                <div>
                  <h1>Link Collections</h1>
                  <GitHubButton
                    href='https://github.com/us3r-network/s3-jssdk/tree/main/packages/examples/link-collections'
                    data-color-scheme='no-preference: light; light: light; dark: dark;'
                    data-icon='octicon-star'
                    aria-label='Star buttons/github-buttons on GitHub'
                  >
                    Source Code
                  </GitHubButton>
                </div>
                <AuthButton />
              </div>
              <Links />
              <CreateLink />
            </div>
          </LinkStateProvider>
        </ProfileStateProvider>
      </Us3rAuthWithRainbowkitProvider>
    </>
  )
}

export default App
