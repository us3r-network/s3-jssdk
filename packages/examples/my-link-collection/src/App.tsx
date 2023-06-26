import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'

import './App.css'
import SignButton from './components/SignButton'
import Links from './components/Links'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <SignButton />
      <Links />
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
