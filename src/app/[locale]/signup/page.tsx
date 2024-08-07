import type { Metadata } from 'next';
import Link from 'next/link';

import { UserSignupForm } from '@/app/[locale]/signup/components/UserSignUpForm';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

export default function SignUpPage({
  params: { lang },
}: Readonly<{
  params: { lang: string };
}>) {
  return (
    <>
      <div className="relative min-h-screen flex-col items-center justify-center grid">
        <Link
          href="/examples/authentication"
          className={cn(buttonVariants({ variant: 'ghost' }), 'absolute right-4 top-4 md:right-8 md:top-8')}
        >
          Login
        </Link>
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
            <p className="text-sm text-muted-foreground">Enter your email below to create your account</p>
          </div>
          <UserSignupForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{' '}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </>
  );
}
