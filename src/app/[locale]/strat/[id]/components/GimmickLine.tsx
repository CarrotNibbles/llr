import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import type { StrategyDataType } from '@/lib/queries/server';
import {
  type ArrayElement,
  GIMMICK_BORDER_STYLE,
  GIMMICK_TEXT_STYLE,
  MAX_DISPLAY_COUNT,
  type MergedGimmick,
  type SuperMergedGimmick,
  cn,
  usePixelPerFrame,
} from '@/lib/utils';
import { useTranslations } from 'next-intl';
import React from 'react';
import { DamageText } from './DamageText';

type GimmickSubLineProps = {
  time: number;
  primaryTime: number;
  pixelPerFrame: number;
  textColor: string;
  borderColor: string;
  resizePanelSize: number;
  translationKey: string;
  lineType: string;
};

export const GimmickSubLine = ({
  time,
  primaryTime,
  pixelPerFrame,
  textColor,
  borderColor,
  resizePanelSize,
  translationKey: translation_key,
  lineType,
}: GimmickSubLineProps) => {
  const tGimmicks = useTranslations('StratPage.Gimmicks');

  return (
    time &&
    Math.abs(time - primaryTime) * pixelPerFrame > 5 && (
      <>
        <div
          className={`absolute border-0 border-t ${borderColor} right-0 ${lineType} z-10 pointer-events-none`}
          style={{
            top: `${time * pixelPerFrame}px`,
            width: `${resizePanelSize}vw`,
          }}
        />
        {Math.abs(time - primaryTime) * pixelPerFrame > 10 && (
          <div
            className={`absolute ${textColor} text-xs z-10 right-0 pointer-events-none`}
            style={{
              top: `${pixelPerFrame * time}px`,
            }}
          >
            <div className="text-xs font-thin right-0">{tGimmicks(translation_key)}</div>
          </div>
        )}
      </>
    )
  );
};

type GimmicksNamesProps = React.ComponentPropsWithRef<'div'> & {
  mergedGimmicks: MergedGimmick[];
};

const GimmicksNames = React.forwardRef<HTMLDivElement, GimmicksNamesProps>(({ className, mergedGimmicks }, ref) => {
  const t = useTranslations('StratPage.GimmickLine');
  const tGimmicks = useTranslations('StratPage.Gimmicks');

  const superMergeGimmicks = (mergedGimmicks: MergedGimmick[]) => {
    const superMergedGimmicks: SuperMergedGimmick[] = [];

    for (const mergedGimmick of mergedGimmicks) {
      if (
        superMergedGimmicks.length === 0 ||
        superMergedGimmicks[superMergedGimmicks.length - 1].translationKey !== mergedGimmick.translationKey ||
        superMergedGimmicks[superMergedGimmicks.length - 1].type !== mergedGimmick.type
      )
        superMergedGimmicks.push({ ...mergedGimmick, mergeCount: 1 });
      else superMergedGimmicks[superMergedGimmicks.length - 1].mergeCount++;
    }

    return superMergedGimmicks;
  };

  const superMergedGimmicks = superMergeGimmicks(mergedGimmicks);

  return (
    <div className={cn('flex text-md', className)}>
      {superMergedGimmicks.slice(0, MAX_DISPLAY_COUNT).map((superMergedGimmick, idx, array) => (
        <div key={superMergedGimmick.id} className={cn(GIMMICK_TEXT_STYLE[superMergedGimmick.type], 'mr-1')}>
          {tGimmicks(superMergedGimmick.translationKey)}
          {superMergedGimmick.mergeCount >= 2 && `×${superMergedGimmick.mergeCount}`}
          {idx !== array.length - 1 && ','}
        </div>
      ))}
      {superMergedGimmicks.length > MAX_DISPLAY_COUNT && (
        <div className={GIMMICK_TEXT_STYLE.AutoAttack}>{t('Etc', { count: superMergedGimmicks.length - 3 })}</div>
      )}
    </div>
  );
});

export type GimmickLineProps = ArrayElement<Exclude<StrategyDataType['raids'], null>['gimmicks']> & {
  displayDamage: boolean;
  damageDisplayGimmick?: ArrayElement<Exclude<StrategyDataType['raids'], null>['gimmicks']>;
  mergedGimmicks: MergedGimmick[];
  resizePanelSize: number;
};

const GimmickLine = React.forwardRef<
  HTMLDivElement,
  GimmickLineProps & {
    className?: string;
  } & React.ComponentPropsWithoutRef<'div'>
>(({ className, ...props }, ref) => {
  const tGimmicks = useTranslations('StratPage.Gimmicks');
  const {
    semantic_key: translationKey,
    type: gimmickType,
    prepare_at: prepareAt,
    cast_at: castAt,
    resolve_at: resolveAt,
    displayDamage,
    damageDisplayGimmick,
    mergedGimmicks,
    resizePanelSize,
  } = props;
  const pixelPerFrame = usePixelPerFrame();
  const textColor = GIMMICK_TEXT_STYLE[gimmickType];
  const borderColor = GIMMICK_BORDER_STYLE[gimmickType];
  const borderWidth = gimmickType === 'Enrage' ? 'border-t-4' : 'border-t-2';
  const titleWeight = gimmickType === 'Enrage' ? 'font-extrabold' : 'font-bold';

  return (
    <div ref={ref}>
      {castAt && (
        <GimmickSubLine
          time={castAt}
          primaryTime={prepareAt}
          textColor={textColor}
          borderColor={borderColor}
          resizePanelSize={resizePanelSize}
          translationKey={translationKey}
          lineType="border-dashed"
          pixelPerFrame={pixelPerFrame}
        />
      )}
      {resolveAt && (
        <GimmickSubLine
          time={resolveAt}
          primaryTime={prepareAt}
          textColor={textColor}
          borderColor={borderColor}
          resizePanelSize={resizePanelSize}
          translationKey={translationKey}
          lineType=""
          pixelPerFrame={pixelPerFrame}
        />
      )}
      <div
        className={`absolute border-0 ${borderWidth} ${borderColor} w-[98dvw] right-0 z-10 pointer-events-none`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      />
      <div
        className={`absolute top-[${prepareAt * pixelPerFrame}px] left-[2dvw]`}
        style={{ top: `${prepareAt * pixelPerFrame}px` }}
      >
        <div className="space-y-1">
          <HoverCard openDelay={300}>
            <HoverCardTrigger>
              {mergedGimmicks.length > 0 && (
                <GimmicksNames
                  mergedGimmicks={mergedGimmicks}
                  className={cn(titleWeight, gimmickType === 'Enrage' && 'mt-1', 'cursor-pointer')}
                />
              )}
            </HoverCardTrigger>
            <HoverCardContent>
              {mergedGimmicks.length > 0 &&
                mergedGimmicks.map((mergedGimmick, index) => (
                  <div key={mergedGimmick.id} className={cn(className, 'space-y-1 mb-1')}>
                    <div className={cn(GIMMICK_TEXT_STYLE[mergedGimmick.type], 'text-xs', 'font-bold')}>
                      {tGimmicks(mergedGimmick.translationKey)}
                    </div>
                    <div className="grid text-sm gap-x-2 gap-y-1" style={{ gridTemplateColumns: 'auto auto auto' }}>
                      <DamageText damages={mergedGimmick.damages} />
                    </div>
                    {index !== mergedGimmicks.length - 1 && <Separator className="mt-1" />}
                  </div>
                ))}
            </HoverCardContent>
          </HoverCard>
          {mergedGimmicks.length > 0 && displayDamage && damageDisplayGimmick && (
            <div className={className}>
              <div className="inline-grid text-sm gap-x-2 gap-y-1" style={{ gridTemplateColumns: 'auto auto auto' }}>
                <DamageText damages={damageDisplayGimmick.damages} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

GimmickSubLine.displayName = 'GimmickSubLine';
GimmicksNames.displayName = 'GimmicksNames';
GimmickLine.displayName = 'DamageEvaluation';

export { GimmickLine };
