'use client';

import { createApp } from '@shopify/app-bridge';
import { useSearchParams } from 'next/navigation';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AppBridgeContextType {
  app: any;
  ready: boolean;
}

const AppBridgeContext = createContext<AppBridgeContextType>({ app: null, ready: false });

export const useAppBridge = () => useContext(AppBridgeContext);

interface AppBridgeProviderProps {
  children: ReactNode;
}

export default function AppBridgeProvider({ children }: AppBridgeProviderProps) {
  const [app, setApp] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const host = searchParams.get('host');
    const shop = searchParams.get('shop');

    if (host && shop) {
      const appBridge = createApp({
        apiKey: process.env.NEXT_PUBLIC_SHOPIFY_API_KEY || '',
        host: host,
        forceRedirect: true,
      });

      setApp(appBridge);
      setReady(true);
      
      // Make app globally available
      (window as any).app = appBridge;
    }
  }, [searchParams]);

  return (
    <AppBridgeContext.Provider value={{ app, ready }}>
      {children}
    </AppBridgeContext.Provider>
  );
}