import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { cn } from '@/lib/utils';
import RecoilRootProvider from '@/components/RecoilRootProvider';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  variable: '--font-sans',
  preload: true,
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <RecoilRootProvider>
      <html lang="en">
        <body
          className={cn('min-h-screen bg-background font-sans antialiased', pretendard.className)}
        >
          {children}
        </body>
      </html>
    </RecoilRootProvider>
  );
}
