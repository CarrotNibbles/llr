import { ProseArticle } from '@/components/ProseArticle';
import { getLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';

export default async function DocumentPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;

  const { slug } = params;

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
