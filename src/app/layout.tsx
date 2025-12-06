import localFont from 'next/font/local';
import './globals.css';
import { StaticDataProvider } from '@/components/providers/StaticDataProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils/helpers';
import { Provider as JotaiProvider } from 'jotai';
import { getLocale } from 'next-intl/server';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  fallback: [
    'Pretendard',
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'Helvetica Neue',
    'Segoe UI',
    'Apple SD Gothic Neo',
    'Noto Sans KR',
    'Malgun Gothic',
    'Apple Color Emoji',
    'Segoe UI Emoji',
    'Segoe UI Symbol',
    'sans-serif',
  ],
  variable: '--font-sans',
  display: 'optional',
  preload: true,
});

export default async function RootLayout(
  props: Readonly<{
    children: React.ReactNode;
  }>,
): Promise<React.ReactElement> {
  const lang = await getLocale();

  const { children } = props;

  return (
    <JotaiProvider>
      <StaticDataProvider>
        <html lang={lang}>
          <body className={cn('min-h-screen bg-background font-sans antialiased', pretendard.variable)}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster />
            </ThemeProvider>
          </body>
        </html>
      </StaticDataProvider>
    </JotaiProvider>
  );
}
