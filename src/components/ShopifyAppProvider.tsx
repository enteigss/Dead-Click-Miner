'use client';

import { AppProvider } from '@shopify/polaris';
import { useSearchParams } from 'next/navigation';
import { ReactNode } from 'react';

interface ShopifyAppProviderProps {
  children: ReactNode;
}

export default function ShopifyAppProvider({ children }: ShopifyAppProviderProps) {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  const host = searchParams.get('host');

  // Check if we're in a Shopify embedded context
  const isEmbedded = typeof window !== 'undefined' && window.top !== window.self;
  
  return (
    <AppProvider
      i18n={{}}
      features={{
        newDesignLanguage: true,
      }}
    >
      {children}
    </AppProvider>
  );
}