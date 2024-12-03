import { ProseArticle } from '@/components/ProseArticle';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
  const locale = await getLocale();
  const t = await getTranslations('Common.Meta');

  const frontmatter = (await import(`./contents/${locale}/${slug.join('/')}.mdx`)).frontmatter;

  const title = `${frontmatter.title} ⬩ LLR`;
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

export default async function DocumentPage(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;

  const locale = await getLocale();

  try {
    const Document = (await import(`./contents/${locale}/${slug.join('/')}.mdx`)).default;

    return (
      <div className="flex flex-col w-full max-w-screen-md px-6 md:py-6 py-3">
        <ProseArticle>
          <Document />
        </ProseArticle>
      </div>
    );
  } catch {
    notFound();
  }
}
