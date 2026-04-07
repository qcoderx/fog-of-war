import { useState, useEffect, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import './WalletSelector.css';

export default function WalletSelector() {
  const { wallets, select, connected, disconnect, wallet, connect, connecting } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const connectTimeoutRef = useRef(null);

  // Auto-connect after wallet is selected
  useEffect(() => {
    if (wallet && !connected && !connecting && wallet.readyState === 'Installed') {
      // Clear any existing timeout
      if (connectTimeoutRef.current) {
        clearTimeout(connectTimeoutRef.current);
      }

      // Try to connect
      const timer = setTimeout(() => {
        connect().catch(err => {
          console.error('Auto-connect failed:', err);
        });
      }, 100);

      // Set a timeout to cancel if connection takes too long
      connectTimeoutRef.current = setTimeout(() => {
        if (connecting && !connected) {
          console.warn('Connection timeout - cancelling');
          disconnect().catch(console.error);
        }
      }, 10000); // 10 second timeout

      return () => {
        clearTimeout(timer);
        if (connectTimeoutRef.current) {
          clearTimeout(connectTimeoutRef.current);
        }
      };
    }
  }, [wallet, connected, connecting, connect, disconnect]);

  const handleSelect = async (walletName) => {
    try {
      // Disconnect current wallet if connected
      if (connected) {
        await disconnect();
        // Wait for disconnect to complete
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Select the new wallet (useEffect will handle connection)
      select(walletName);
      setIsOpen(false);
    } catch (error) {
      console.error('Wallet selection error:', error);
      setIsOpen(false);
    }
  };

  const handleChangeWallet = async () => {
    if (connected) {
      await disconnect();
    }
    setIsOpen(true);
  };

  if (connected && !isOpen) {
    return (
      <button className="wallet-selector__change" onClick={handleChangeWallet}>
        <span className="wallet-selector__icon">🔄</span>
        Change Wallet
      </button>
    );
  }

  // Show retry button if stuck connecting
  if (connecting && !connected && !isOpen) {
    return (
      <button className="wallet-selector__retry" onClick={() => disconnect()}>
        <span className="wallet-selector__icon">⚠️</span>
        Connection Stuck - Click to Retry
      </button>
    );
  }

  return (
    <div className="wallet-selector">
      {!isOpen && !connected && (
        <button className="wallet-selector__trigger" onClick={() => setIsOpen(true)}>
          <span className="wallet-selector__icon">👛</span>
          Select Wallet
        </button>
      )}

      {isOpen && (
        <div className="wallet-selector__modal">
          <div className="wallet-selector__backdrop" onClick={() => setIsOpen(false)} />
          <div className="wallet-selector__content">
            <div className="wallet-selector__header">
              <h3>Select Wallet</h3>
              <button className="wallet-selector__close" onClick={() => setIsOpen(false)}>
                ✕
              </button>
            </div>

            <div className="wallet-selector__list">
              {wallets.filter(w => w.readyState === 'Installed' && w.adapter.name !== 'MetaMask').map((w) => (
                <button
                  key={w.adapter.name}
                  className="wallet-selector__item"
                  onClick={() => handleSelect(w.adapter.name)}
                >
                  <img src={w.adapter.icon} alt={w.adapter.name} className="wallet-selector__logo" />
                  <span>{w.adapter.name}</span>
                  <span className="wallet-selector__badge">Installed</span>
                </button>
              ))}

              {wallets.filter(w => w.readyState !== 'Installed').map((w) => (
                <button
                  key={w.adapter.name}
                  className="wallet-selector__item wallet-selector__item--disabled"
                  onClick={() => window.open(w.adapter.url, '_blank')}
                >
                  <img src={w.adapter.icon} alt={w.adapter.name} className="wallet-selector__logo" />
                  <span>{w.adapter.name}</span>
                  <span className="wallet-selector__badge wallet-selector__badge--install">Install</span>
                </button>
              ))}
            </div>

            <div className="wallet-selector__footer">
              <a href="https://phantom.app" target="_blank" rel="noopener noreferrer">
                Don't have a wallet? Get Phantom →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
