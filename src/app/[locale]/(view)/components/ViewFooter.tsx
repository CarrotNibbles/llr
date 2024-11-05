import { LocaleSwitchLink } from '@/components/LocaleSwitchLink';
import { BrandIdentity } from '@/components/icons/BrandIdentity';
import { cn } from '@/lib/utils';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';

const getYearString = (start: number, end: number) => {
  if (start === end) {
    return start.toString();
  }
  return `${start} - ${end}`;
};

// TODO: Add X link, privacy policy

type ViewFooterProps = Readonly<React.HTMLAttributes<HTMLDivElement> & {}>;

export async function ViewFooter({ className, ...props }: { className?: string } & ViewFooterProps) {
  const t = await getTranslations('ViewPage.Footer');
  const year = new Date().getFullYear();

  return (
    <div className={cn(className, 'min-w-full flex items-center justify-center py-8 bg-secondary')} {...props}>
      <div className="w-full max-w-screen-xl px-6 space-y-6 md:space-y-0 md:flex md:flex-row-reverse md:items-center md:justify-between">
        <div className="space-y-2 md:text-right">
          <p className="text-muted-foreground sm:text-xs text-2xs font-bold">
            <Link href="link-to-privacy-policy" className="hover:underline">
              {t('PrivacyPolicy')}
            </Link>
          </p>
          <p className="text-muted-foreground sm:text-xs text-2xs">
            {t('FFCopyright', { yearString: getYearString(2010, year) })}
            <br />
            {t('Trademark')}
            <br />
            {t('NotAffiliated')}
          </p>
        </div>
        <div className="flex sm:space-x-4 space-x-2 items-center">
          <BrandIdentity variant="light" className="fill-muted-foreground md:h-11 sm:h-9 h-7" />
          <p className="text-muted-foreground sm:text-xs text-2xs">
            {t('Copyright', { yearString: getYearString(2024, year) })}
            <br />
            <LocaleSwitchLink locale="ko" className="hover:underline">
              한국어
            </LocaleSwitchLink>
            {' · '}
            <LocaleSwitchLink locale="en" className="hover:underline">
              English
            </LocaleSwitchLink>
            {' · '}
            <LocaleSwitchLink locale="ja" className="hover:underline">
              日本語(β)
            </LocaleSwitchLink>
            <br />
            <Link href="link-to-x" className="hover:underline">
              X
            </Link>
            {' · '}
            <Link href="mailto:support@llr.app" className="hover:underline">
              Mail
            </Link>
            {' · '}
            <Link href="https://github.com/CarrotNibbles" className="hover:underline">
              GitHub
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
