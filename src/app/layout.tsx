import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import '@shopify/polaris/build/esm/styles.css';
import PolarisProvider from '../components/PolarisProvider';
import AppBridgeProvider from '../components/AppBridgeProvider';
import "./globals.css";
import { Suspense } from 'react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Dead Click Miner",
  description: "Shopify app for tracking and analyzing dead clicks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppBridgeProvider>
            <PolarisProvider>
              {children}
            </PolarisProvider>
          </AppBridgeProvider>
        </Suspense>
      </body>
    </html>
  );
}
