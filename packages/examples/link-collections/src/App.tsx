import { Us3rAuthWithRainbowkitProvider } from '@us3r-network/auth-with-rainbowkit';
import AuthButton from './components/AuthButton';
import './App.css';

function App() {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <AuthButton />
    </Us3rAuthWithRainbowkitProvider>
  );
}

export default App
