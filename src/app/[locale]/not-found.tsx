'use client'; // Error components must be Client Components

import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function NotFoundPage() {
  const t = useTranslations('ErrorPage');

  return (
    <div className="px-8 w-screen h-screen min-h-screen flex items-center justify-center">
      <div className="max-w-screen-xl flex flex-col items-center">
        <h1 className="sm:text-5xl text-4xl font-bold">404</h1>
        <p className="text-muted-foreground sm:text-lg text-sm sm:mt-4 mt-3">{t('NotFound')}</p>
        <Link href="/">
          <Button className="sm:mt-12 mt-9">{t('GoHome')}</Button>
        </Link>
      </div>
    </div>
  );
}
