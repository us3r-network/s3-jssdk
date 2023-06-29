import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit';
import AuthButton from './components/AuthButton';
import Links from './components/Links';
import './App.css';
import CreateLink from './components/CreateLink';

function App() {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <AuthButton />
      <Links />
      <CreateLink/>
    </Us3rAuthWithRainbowkitProvider>
  );
}

export default App
