import { Separator } from '@/components/ui/separator';
import { HeaderAreaColumn } from './headerAreaColumn';
import { type ForwardedRef, forwardRef } from 'react';

const HeaderAreaInner = ({ job }: { job: any }, ref: ForwardedRef<HTMLDivElement>) => (
  <div className="w-full sticky header-area pt-1 border-x-2 border-t-2 rounded-t-sm" ref={ref}>
    <div className="grid grid-rows-2">
      <div>
        <div className="grid text-center items-center">나이트{/* 할일 */}</div>
        <Separator />
      </div>
      <ul className="flex">
        <HeaderAreaColumn key={0} />
        <HeaderAreaColumn key={1} />
        <HeaderAreaColumn key={2} />
        <HeaderAreaColumn key={3} />
        <HeaderAreaColumn key={4} />
        <HeaderAreaColumn key={5} />
      </ul>
      <Separator orientation="vertical" />
    </div>
  </div>
);

export const HeaderArea = forwardRef(HeaderAreaInner);
