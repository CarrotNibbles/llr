import React from 'react';
import { Button } from '@/components/ui/button';
import { CopyIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

const StratHeader = React.forwardRef<
  HTMLDivElement,
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('rounded-none border-b flex space-x-4 py-2 px-4 items-center', className)}
      {...props}
    >
      <div className="font-bold">내가 시발 부릅니다: 살려주세요</div>
      <div className="text-muted-foreground">마의 전당 판데모니움: 천옥편 4(영웅)</div>
      <div className="flex-grow"></div>
      <div className="flex">
        <Button variant="ghost" size="icon">
          <Share1Icon />
        </Button>
        <Button variant="ghost" size="icon">
          <CopyIcon />
        </Button>
      </div>
      <Button className="">
        <HeartIcon className="mr-2" />
        13598
      </Button>
    </div>
  );
});

StratHeader.displayName = 'StratHeader';

export { StratHeader };
