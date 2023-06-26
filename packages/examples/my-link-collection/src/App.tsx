import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit'

import './App.css'
import SignButton from './components/SignButton'

function App () {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <SignButton />
    </Us3rAuthWithRainbowkitProvider>
  )
}

export default App
