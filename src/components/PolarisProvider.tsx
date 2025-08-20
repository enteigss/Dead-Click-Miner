'use client';

import { AppProvider } from '@shopify/polaris';
import enTranslations from '@shopify/polaris/locales/en.json';

interface PolarisProviderProps {
  children: React.ReactNode;
}

export default function PolarisProvider({ children }: PolarisProviderProps) {
  return (
    <AppProvider i18n={enTranslations}>
      {children}
    </AppProvider>
  );
}