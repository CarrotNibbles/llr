'use client';

import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { useTank } from '@/lib/calc/hooks';
import type { Enums } from '@/lib/database.types';
import type { StrategyDataType } from '@/lib/queries/server';
import { cn } from '@/lib/utils/helpers';
import type { ArrayElement } from '@/lib/utils/types';
import { deepEqual } from 'fast-equals';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import React from 'react';
import { useContextSelector } from 'use-context-selector';
import { ACTIVE_DAMAGE_OPTION_STYLE, INACTIVE_DAMAGE_OPTION_STYLE } from '../../utils/constants';
import { MitigatedDamagesContext } from './MitigatedDamagesContext';

type DamageAmountsProps = {
  currentDamage: number;
  defaultDamage: number;
};

export const DamageTypeIcon = (props: { damageType: Enums<'damage_type'> }) => {
  const { damageType } = props;

  const src = `/icons/damage/${damageType.toLowerCase()}.png`;

  return <Image src={src} alt={damageType} width={16} height={16} className='inline' />;
};

export const DamageAmounts = (props: DamageAmountsProps) => {
  const { currentDamage, defaultDamage } = props;

  return (
    <>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

type DamageTextProps = {
  damageId: string;
  damageType: Enums<'damage_type'>;
  defaultDamage: number;
  currentDamage: number;
  numTargets: number;
  primaryTarget?: string;
  numShared?: number;
};

const BothTankBuster = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage } = props;

  return (
    <>
      <div className="space-x-1 pr-4 flex items-center">
        <DamageTypeIcon damageType={damageType} />
        <span className={ACTIVE_DAMAGE_OPTION_STYLE}>T1+T2</span>
      </div>
      <DamageAmounts currentDamage={currentDamage} defaultDamage={defaultDamage} />
    </>
  );
};

const SingleTankBuster = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage, primaryTarget } = props;

  const [mainTank, offTank] = useTank();
  const elevated = useStratSyncStore((state) => state.elevated);
  const upsertDamageOption = useStratSyncStore((state) => state.upsertDamageOption);

  const activeOption = primaryTarget === offTank ? 1 : 0;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-4 flex items-center min-w-16">
        <DamageTypeIcon damageType={damageType} />
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 0 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 0) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                primaryTarget: mainTank,
              },
              false,
            );
          }}
        >
          T1
        </span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 1 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 1) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                primaryTarget: offTank,
              },
              false,
            );
          }}
        >
          T2
        </span>
      </div>

      <DamageAmounts currentDamage={currentDamage} defaultDamage={defaultDamage} />
    </>
  );
};

const ShareTankBuster = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage, primaryTarget } = props;

  const [mainTank, offTank] = useTank();
  const elevated = useStratSyncStore((state) => state.elevated);
  const upsertDamageOption = useStratSyncStore((state) => state.upsertDamageOption);

  const activeOption = primaryTarget === undefined ? 0 : primaryTarget === mainTank ? 1 : 2;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-4 flex items-center min-w-28">
        <DamageTypeIcon damageType={damageType} />
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 0 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 0) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                numShared: 2,
              },
              false,
            );
          }}
        >
          T1+T2
        </span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 1 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 1) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                primaryTarget: mainTank,
                numShared: 1,
              },
              false,
            );
          }}
        >
          T1
        </span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 2 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 2) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                primaryTarget: offTank,
                numShared: 1,
              },
              false,
            );
          }}
        >
          T2
        </span>
      </div>

      <DamageAmounts
        currentDamage={currentDamage}
        defaultDamage={defaultDamage / (activeOption === 0 ? 2 : 1)}
      />
    </>
  );
};

const ShareAllRaidWide = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage } = props;
  const t = useTranslations('StratPage.DamageText');

  return (
    <>
      <div className="space-x-1 pr-4 flex items-center">
      <DamageTypeIcon damageType={damageType} />

        <span className={ACTIVE_DAMAGE_OPTION_STYLE}>{t('DamageOption.Share')}</span>
      </div>
      <DamageAmounts currentDamage={currentDamage} defaultDamage={defaultDamage / 8} />
    </>
  );
};

const RaidWide = (props: DamageTextProps) => {
  const { numTargets, damageType, defaultDamage, currentDamage } = props;
  const t = useTranslations('StratPage.DamageText');

  const text =
    numTargets === 8
      ? t('DamageOption.RaidWide')
      : numTargets === 1
        ? t('DamageOption.SingleTarget')
        : t('DamageOption.NTargets', { numTargets });

  return (
    <>
      <div className="space-x-1 pr-4 flex items-center">
      <DamageTypeIcon damageType={damageType} />

        <span className={ACTIVE_DAMAGE_OPTION_STYLE}>{text}</span>
      </div>
      <DamageAmounts currentDamage={currentDamage} defaultDamage={defaultDamage} />
    </>
  );
};

const ShareHalfRaidWide = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage, numShared } = props;

  const elevated = useStratSyncStore((state) => state.elevated);
  const upsertDamageOption = useStratSyncStore((state) => state.upsertDamageOption);

  const activeOption = numShared === 3 ? 1: 0;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-4 flex items-center min-w-20">
      <DamageTypeIcon damageType={damageType} />

        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 0 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 0) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                numShared: 4,
              },
              false,
            );
          }}
        >
          4+4
        </span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 1 ? ACTIVE_DAMAGE_OPTION_STYLE : INACTIVE_DAMAGE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 1) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                numShared: 3,
              },
              false,
            );
          }}
        >
          3+5
        </span>
      </div>
      <DamageAmounts
        currentDamage={currentDamage}
        defaultDamage={Math.round(defaultDamage / (activeOption === 0 ? 4 : 3))}
      />
    </>
  );
};

// This is a fallback component for when the damage type is unknown
const Unknown = () => {
  const t = useTranslations('StratPage.DamageText');

  return <div className="space-x-1 pr-4 flex items-center">{t('DamageOption.Unknown')}</div>;
};
const componentSelector = (target: 'Raidwide' | 'Tankbuster', numTargets: number, maxShared: number) => {
  if (target === 'Tankbuster') {
    if (numTargets === 1 && maxShared === 1) return SingleTankBuster;
    if (numTargets === 1 && maxShared === 2) return ShareTankBuster;
    if (numTargets === 2) return BothTankBuster;
  }

  if (target === 'Raidwide') {
    if (numTargets === 1 && maxShared === 8) return ShareAllRaidWide;
    if (numTargets === 2 && maxShared === 4) return ShareHalfRaidWide;
    if (maxShared === 1) return RaidWide;
  }

  return Unknown;
};

const DamageText = React.memo(
  ({
    damage,
  }: { damage: ArrayElement<ArrayElement<Exclude<StrategyDataType['raids'], null>['gimmicks']>['damages']> }) => {
    const mitigatedDamage = useContextSelector(
      MitigatedDamagesContext,
      (mitigatedDamages) => mitigatedDamages[damage.id],
    );

    const textProps = {
      damageId: damage.id,
      damageType: damage.type,
      defaultDamage: damage.combined_damage,
      numTargets: damage.num_targets,
      currentDamage: mitigatedDamage ?? damage.combined_damage,
      primaryTarget: damage.strategy_damage_options?.[0]?.primary_target ?? undefined,
      numShared: damage.strategy_damage_options?.[0]?.num_shared ?? undefined,
    };

    const TextComponent = componentSelector(damage.target, damage.num_targets, damage.max_shared);

    return <TextComponent {...textProps} />;
  },
);

const DamagesText = React.memo(
  ({
    damages,
  }: {
    damages: ArrayElement<Exclude<StrategyDataType['raids'], null>['gimmicks']>['damages'];
  }) => {
    return (
      <>
        {damages.map((damage) => (
          <DamageText key={`damagetext-${damage.id}`} damage={damage} />
        ))}
      </>
    );
  },
  deepEqual,
);

DamageText.displayName = 'DamageText';
DamagesText.displayName = 'DamagesText';

export { DamagesText };
