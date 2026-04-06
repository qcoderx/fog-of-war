import { useWallet } from '@solana/wallet-adapter-react';

export default function WalletDebug() {
  const wallet = useWallet();

  // Only show in development
  if (import.meta.env.PROD) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 10,
      right: 10,
      background: 'rgba(0,0,0,0.9)',
      color: '#0f0',
      padding: '10px',
      fontSize: '10px',
      fontFamily: 'monospace',
      borderRadius: '4px',
      maxWidth: '300px',
      zIndex: 9999,
    }}>
      <div><strong>Wallet Debug:</strong></div>
      <div>Connected: {wallet.connected ? '✅' : '❌'}</div>
      <div>Connecting: {wallet.connecting ? '⏳' : '✅'}</div>
      <div>PublicKey: {wallet.publicKey ? '✅' : '❌'}</div>
      <div>SignMessage: {wallet.signMessage ? '✅' : '❌'}</div>
      <div>Wallet: {wallet.wallet?.adapter?.name || 'None'}</div>
      <div>ReadyState: {wallet.wallet?.adapter?.readyState || 'N/A'}</div>
    </div>
  );
}
