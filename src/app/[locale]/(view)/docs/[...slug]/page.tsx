import { ProseArticle } from '@/components/ProseArticle';
import { getLocale } from 'next-intl/server';

export default async function DocumentPage({ params: { slug } }: { params: { slug: string[] } }) {
  const locale = await getLocale();

  const Doc = (await import(`./contents/${locale}/${slug.join('/')}.mdx`)).default;

  return (
    <div className="flex flex-col w-full max-w-screen-md px-6 md:py-6 py-3">
      <ProseArticle>
        <Doc />
      </ProseArticle>
    </div>
  );
}
