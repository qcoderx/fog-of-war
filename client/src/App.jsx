import { useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { 
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from '@solana/web3.js';
import '@solana/wallet-adapter-react-ui/styles.css';

import { useGameStore } from './store';
import Landing from './components/Landing';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Results from './components/Results';

function Router() {
  const screen = useGameStore((s) => s.screen);
  if (screen === 'lobby')   return <Lobby />;
  if (screen === 'game')    return <Game />;
  if (screen === 'results') return <Results />;
  return <Landing />;
}

export default function App() {
  const endpoint = useMemo(() => clusterApiUrl('devnet'), []);
  
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
    ],
    []
  );

  const onError = (error) => {
    console.error('Wallet error:', error);
    // Don't throw - just log it
  };

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={false} localStorageKey="fog-of-war-wallet">
        <WalletModalProvider>
          <Router />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
