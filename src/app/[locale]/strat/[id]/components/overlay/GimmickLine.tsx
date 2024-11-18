import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Separator } from '@/components/ui/separator';
import { pixelPerFrameAtom } from '@/lib/atoms';
import type { StrategyDataType } from '@/lib/queries/server';
import { type ArrayElement, cn } from '@/lib/utils';
import { useAtomValue } from 'jotai';
import { useTranslations } from 'next-intl';
import React from 'react';
import { GIMMICK_BORDER_STYLE, GIMMICK_TEXT_STYLE, MAX_DISPLAY_COUNT } from '../../utils/constants';
import { verticalTransformsFactory } from '../../utils/helpers';
import type { MergedGimmick, SuperMergedGimmick } from '../../utils/types';
import { DamagesText } from './DamagesText';

type GimmickSubLineProps = {
  time: number;
  primaryTime: number;
  textColor: string;
  borderColor: string;
  resizePanelSize: number;
  semanticKey: string;
  lineType: string;
};

const GimmickSubLine = ({
  time,
  primaryTime,
  textColor,
  borderColor,
  resizePanelSize,
  semanticKey,
  lineType,
}: GimmickSubLineProps) => {
  const tGimmicks = useTranslations('Common.Gimmicks');

  const pixelPerFrame = useAtomValue(pixelPerFrameAtom);
  const { timeToY } = verticalTransformsFactory(Number.NaN, pixelPerFrame);

  return (
    time &&
    Math.abs(time - primaryTime) * pixelPerFrame > 5 && (
      <>
        <div
          className={`absolute border-0 border-t ${borderColor} right-0 ${lineType} z-10 pointer-events-none`}
          style={{
            top: `${timeToY(time)}px`,
            width: `${resizePanelSize}vw`,
          }}
        />
        {Math.abs(time - primaryTime) * pixelPerFrame > 10 && (
          <div
            className={`absolute ${textColor} text-xs z-10 right-0 pointer-events-none`}
            style={{
              top: `${timeToY(time)}px`,
            }}
          >
            <div className="text-xs right-0">{tGimmicks(semanticKey)}</div>
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
  const tGimmicks = useTranslations('Common.Gimmicks');

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

const GimmickLine = React.memo(
  React.forwardRef<
    HTMLDivElement,
    GimmickLineProps & {
      className?: string;
    } & React.ComponentPropsWithoutRef<'div'>
  >(({ className, ...props }, ref) => {
    const tGimmicks = useTranslations('Common.Gimmicks');
    const {
      semantic_key: semanticKey,
      type: gimmickType,
      prepare_at: prepareAt,
      cast_at: castAt,
      resolve_at: resolveAt,
      displayDamage,
      damageDisplayGimmick,
      mergedGimmicks,
      resizePanelSize,
    } = props;
    const pixelPerFrame = useAtomValue(pixelPerFrameAtom);
    const { timeToY } = verticalTransformsFactory(Number.NaN, pixelPerFrame);

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
            semanticKey={semanticKey}
            lineType="border-dashed"
          />
        )}
        {resolveAt && (
          <GimmickSubLine
            time={resolveAt}
            primaryTime={prepareAt}
            textColor={textColor}
            borderColor={borderColor}
            resizePanelSize={resizePanelSize}
            semanticKey={semanticKey}
            lineType=""
          />
        )}
        <div
          className={`absolute border-0 ${borderWidth} ${borderColor} w-[98dvw] right-0 z-10 pointer-events-none`}
          style={{ top: `${timeToY(prepareAt)}px` }}
        />
        <div className="absolute left-[2dvw]" style={{ top: `${timeToY(prepareAt)}px` }}>
          <div className="space-y-1">
            <HoverCard openDelay={100}>
              <HoverCardTrigger>
                {mergedGimmicks.length > 0 && (
                  <GimmicksNames
                    mergedGimmicks={mergedGimmicks}
                    className={cn(titleWeight, gimmickType === 'Enrage' && 'mt-1', 'cursor-pointer')}
                  />
                )}
              </HoverCardTrigger>
              <HoverCardContent className="w-auto" align="start">
                {mergedGimmicks.length > 0 &&
                  mergedGimmicks.map((mergedGimmick, index) => (
                    <div key={mergedGimmick.id} className={cn(className, 'space-y-1 mb-1')}>
                      <div className={cn(GIMMICK_TEXT_STYLE[mergedGimmick.type], 'text-xs', 'font-bold')}>
                        {tGimmicks(mergedGimmick.translationKey)}
                      </div>
                      <div className="grid text-sm gap-x-2 gap-y-1" style={{ gridTemplateColumns: 'auto auto auto' }}>
                        <DamagesText damages={mergedGimmick.damages} />
                      </div>
                      {index !== mergedGimmicks.length - 1 && <Separator className="mt-1" />}
                    </div>
                  ))}
              </HoverCardContent>
            </HoverCard>
            {mergedGimmicks.length > 0 && displayDamage && damageDisplayGimmick && (
              <div className={className}>
                <div className="inline-grid text-sm gap-x-2 gap-y-1" style={{ gridTemplateColumns: 'auto auto auto' }}>
                  <DamagesText damages={damageDisplayGimmick.damages} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }),
);

GimmickSubLine.displayName = 'GimmickSubLine';
GimmicksNames.displayName = 'GimmicksNames';
GimmickLine.displayName = 'DamageEvaluation';

export { GimmickLine };
