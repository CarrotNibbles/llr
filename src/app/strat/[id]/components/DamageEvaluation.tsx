import React from 'react';
import { Button } from '@/components/ui/button';
import { CopyIcon, HeartIcon, Share1Icon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

const DamageEvaluation = React.forwardRef<
  HTMLDivElement,
  { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div ref={ref}>
      <div className="absolute border-0 border-t border-blue-600 w-[96dvw] top-[180px] right-0 border-dashed"></div>
      <div className="absolute border-0 border-t border-blue-600 w-[98dvw] top-[200px] right-0"></div>
      <div className="absolute top-[200px] left-[2dvw] -z-10">
        <div className="-z-10 space-y-2">
          <div className="text-blue-600 font-bold text-md">판데모니움 격돌</div>
          <div
            className="inline-grid text-sm gap-x-2 gap-y-1"
            style={{ gridTemplateColumns: 'auto auto auto' }}
          >
            <div className="space-x-1 pr-6">
              <span className="font-bold">T1+T2</span>
            </div>
            <span className="tabular-nums font-bold">100000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">180000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">T1</span>
              <span className="text-muted-foreground">T2</span>
            </div>
            <span className="tabular-nums font-bold">100000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">180000</span>

            <div className="space-x-1 pr-6">
              <span className="text-muted-foreground">T1+T2</span>
              <span className="font-bold">T1</span>
              <span className="text-muted-foreground">T2</span>
            </div>
            <span className="tabular-nums font-bold">240000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">480000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">쉐어</span>
            </div>
            <span className="tabular-nums font-bold">40000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">70000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">전체</span>
            </div>
            <span className="tabular-nums font-bold">35000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">60000</span>

            <div className="space-x-1 pr-6">
              <span className="font-bold">4+4</span>
              <span className="text-muted-foreground">3+5</span>
            </div>
            <span className="tabular-nums font-bold">21000</span>
            <span className="text-muted-foreground tabular-nums text-xs my-auto">40000</span>
          </div>
        </div>
      </div>
    </div>
  );
});

DamageEvaluation.displayName = 'DamageEvaluation';

export { DamageEvaluation };
