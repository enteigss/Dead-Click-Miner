'use client';

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';
import { useSearchParams } from 'next/navigation';

interface PolarisProviderProps {
  children: React.ReactNode;
}

export default function PolarisProvider({ children }: PolarisProviderProps) {
  const searchParams = useSearchParams();
  const shop = searchParams.get('shop');
  
  return (
    <AppProvider 
      i18n={enTranslations}
      features={{
        newDesignLanguage: true,
      }}
    >
      {children}
    </AppProvider>
  );
}