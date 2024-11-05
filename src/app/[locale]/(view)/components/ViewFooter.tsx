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

// TODO: Add X link

type ViewFooterProps = Readonly<React.HTMLAttributes<HTMLDivElement> & {}>;

export async function ViewFooter({ className, ...props }: { className?: string } & ViewFooterProps) {
  const t = await getTranslations('ViewPage.Footer');
  const year = new Date().getFullYear();

  return (
    <div className={cn(className, 'min-w-full flex items-center justify-center py-8 bg-secondary')} {...props}>
      <div className="w-full max-w-screen-xl px-6 space-y-6 text-muted-foreground sm:text-xs text-2xs md:space-y-0 md:flex md:flex-row-reverse md:items-center md:justify-between">
        <div className="space-y-2 md:text-right">
          <p>
            <Link href="/docs/terms" className="hover:underline">
              {t('TermsOfService')}
            </Link>
            <span className="mx-1">·</span>
            <Link href="/docs/privacy" className="hover:underline font-bold">
              {t('PrivacyPolicy')}
            </Link>
          </p>
          <p>
            © {getYearString(2010, year)} SQUARE ENIX CO., LTD. Published in Korea by ACTOZ SOFT CO., LTD.
            <br />
            {t('Trademark')}
            <br />
            {t('NotAffiliated')}
          </p>
        </div>
        <div className="flex sm:space-x-4 space-x-2 items-center">
          <BrandIdentity variant="light" className="fill-muted-foreground md:h-11 sm:h-9 h-7" />
          <p>
            © {getYearString(2024, year)} <span className="font-bold">CarrotNibbles.</span>
            <br />
            <LocaleSwitchLink locale="ko" className="hover:underline">
              한국어
            </LocaleSwitchLink>
            <span className="mx-1">·</span>
            <LocaleSwitchLink locale="en" className="hover:underline">
              English
            </LocaleSwitchLink>
            <span className="mx-1">·</span>
            <LocaleSwitchLink locale="ja" className="hover:underline">
              日本語(β)
            </LocaleSwitchLink>
            <br />
            <Link href="link-to-x" className="hover:underline">
              X
            </Link>
            <span className="mx-1">·</span>
            <Link href="mailto:support@llr.app" className="hover:underline">
              Mail
            </Link>
            <span className="mx-1">·</span>
            <Link href="https://github.com/CarrotNibbles" className="hover:underline">
              GitHub
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
