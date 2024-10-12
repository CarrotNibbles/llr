'use server';

import type React from 'react';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

const TAILWIND_TEXT_SIZE = [
  'xs',
  'sm',
  'base',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
  '8xl',
  '9xl',
] as const;
type TailwindTextSize = (typeof TAILWIND_TEXT_SIZE)[number];

const LineHeightClass: Record<TailwindTextSize, string> = {
  xs: 'h-4',
  sm: 'h-5',
  base: 'h-6',
  lg: 'h-7',
  xl: 'h-7',
  '2xl': 'h-8',
  '3xl': 'h-9',
  '4xl': 'h-10',
  '5xl': 'h-12',
  '6xl': 'h-[60px]',
  '7xl': 'h-[72px]',
  '8xl': 'h-24',
  '9xl': 'h-32',
};
const SkeletonHeightClass: Record<TailwindTextSize, string> = {
  xs: 'h-3',
  sm: 'h-[14px]',
  base: 'h-4',
  lg: 'h-[18px]',
  xl: 'h-5',
  '2xl': 'h-6',
  '3xl': 'h-[30px]',
  '4xl': 'h-9',
  '5xl': 'h-12',
  '6xl': 'h-[60px]',
  '7xl': 'h-[72px]',
  '8xl': 'h-24',
  '9xl': 'h-32',
};

type TextSkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  textSize: TailwindTextSize;
  mdTextSize?: TailwindTextSize;
};

export const TextSkeleton: React.FC<TextSkeletonProps> = ({ textSize, mdTextSize, className, ...props }) => (
  <div
    className={cn(
      LineHeightClass[textSize],
      mdTextSize ? `md:${LineHeightClass[mdTextSize]}` : '',
      'flex items-center',
      className,
    )}
    {...props}
  >
    <Skeleton
      className={cn(
        SkeletonHeightClass[textSize],
        mdTextSize ? `md:${SkeletonHeightClass[mdTextSize]}` : '',
        'flex-grow',
      )}
    />
  </div>
);
