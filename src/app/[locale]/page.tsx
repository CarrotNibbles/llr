'use server';

import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

export async function generateMetadata() {
  const t = await getTranslations('Common.Meta');

  const title = 'LLR';
  const description = t('Description');
  const hostURI = process.env.HOST_URI;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: hostURI,
    },
    twitter: {
      card: 'summary',
      site: '@replace-this-with-twitter-handle',
    },
  };
}

export default async function Home() {
  redirect('/board');
}
