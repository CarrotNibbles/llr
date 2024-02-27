import { type Database } from '@/lib/database.types';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT } from '@supabase/supabase-js';
import React from 'react';

export type DamageEvaluationProps = Database['public']['Tables']['gimmicks']['Row'] & {
  damages: Array<Database['public']['Tables']['damages']['Row']>;
} & {
  resizePanelSize: number;
};

const TankbusterColor = 'blue';
const RaidwideColor = 'red';
const CombinedColor = 'purple';

const DamageEvaluation = React.forwardRef<
  HTMLDivElement,
  DamageEvaluationProps & { className?: string } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const { damages } = props;
  const color = damages.some((d) => d.target === 'Tankbuster')
    ? damages.some((d) => d.target === 'Raidwide')
      ? CombinedColor
      : TankbusterColor
    : RaidwideColor;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { name, prepare_at, cast_at, resolve_at, resizePanelSize } = props;

  const zoom = 1;

  return (
    <div ref={ref}>
      {cast_at && (
        <div
          className={`absolute border-0 border-t border-${color}-600  top-[${zoom * cast_at}px] right-0 border-dashed`}
          style={{ top: `${zoom * cast_at}px`, width: `${resizePanelSize}vw` }}
        />
      )}
      {resolve_at && (
        <div
          className={`absolute border-0 border-t border-${color}-600 top-[${zoom * resolve_at}px] right-0`}
          style={{ top: `${zoom * resolve_at}px`, width: `${resizePanelSize}vw` }}
        />
      )}
      <div
        className={`absolute border-0 border-t-2 border-${color}-600 w-[98dvw] right-0`}
        style={{ top: `${zoom * prepare_at}px` }}
      />
      <div
        className={`absolute top-[${zoom * prepare_at}px] left-[2dvw] -z-10`}
        style={{ top: `${zoom * prepare_at}px` }}
      >
        <div className="-z-10 space-y-2">
          <div className={`text-${color}-600 font-bold text-md`}>{name}</div>
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
