import { cn } from '@/lib/utils';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import React, { type RefObject } from 'react';
import { ScrollBar } from './ui/scroll-area';

type MyScrollAreaProps = {
  viewportRef?: RefObject<HTMLDivElement>;
} & React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>;

export const MyScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  MyScrollAreaProps
>(({ className, children, viewportRef, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]" ref={viewportRef}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
MyScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
