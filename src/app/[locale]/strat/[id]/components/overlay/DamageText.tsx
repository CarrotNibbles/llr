'use client';

import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { useMitigatedDamages, useTank } from '@/lib/calc/hooks';
import type { StrategyDataType } from '@/lib/queries/server';
import { type ArrayElement, cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ACTIVE_DAMAGE_OPTION_STYLE, INACTIVE_DAMAGE_OPTION_STYLE } from '../../utils/constants';
import type { Enums } from '@/lib/database.types';
import Image from 'next/image';

type DamageAmountsProps = {
  damageType: Enums<'damage_type'>;
  currentDamage: number;
  defaultDamage: number;
};

export const DamageAmounts = (props: DamageAmountsProps) => {
  const { damageType, currentDamage, defaultDamage } = props;

  const src = `/icons/damage/${damageType.toLowerCase()}.png`;

  return (
    <>
      <div className="flex items-center space-x-1">
        <Image src={src} alt={damageType} width={16} height={16} />
        <span className="tabular-nums font-bold">{currentDamage}</span>
      </div>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

type DamageTextProps = {
  damageId: string;
  damageType: Enums<'damage_type'>;
  defaultDamage: number;
  currentDamage: number;
  primaryTarget?: string;
  numShared?: number;
};

const BothTankBuster = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage } = props;

  return (
    <>
      <div className="space-x-1 pr-6">
        <span className={ACTIVE_DAMAGE_OPTION_STYLE}>T1+T2</span>
      </div>
      <DamageAmounts damageType={damageType} currentDamage={currentDamage} defaultDamage={defaultDamage / 2} />
    </>
  );
};

const SingleTankBuster = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage, primaryTarget } = props;

  const [mainTank, offTank] = useTank();
  const { upsertDamageOption, elevated } = useStratSyncStore((state) => state);

  const activeOption = primaryTarget === offTank ? 1 : 0;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-6 min-w-16">
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

      <DamageAmounts damageType={damageType} currentDamage={currentDamage} defaultDamage={defaultDamage} />
    </>
  );
};

const ShareTankBuster = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage, primaryTarget } = props;

  const [mainTank, offTank] = useTank();
  const { upsertDamageOption, elevated } = useStratSyncStore((state) => state);

  const activeOption = primaryTarget === undefined ? 0 : primaryTarget === mainTank ? 1 : 2;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-6 min-w-28">
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
        damageType={damageType}
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
      <div className="space-x-1 pr-6">
        <span className={ACTIVE_DAMAGE_OPTION_STYLE}>{t('DamageOption.Share')}</span>
      </div>
      <DamageAmounts damageType={damageType} currentDamage={currentDamage} defaultDamage={defaultDamage / 8} />
    </>
  );
};

const RaidWide = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage } = props;
  const t = useTranslations('StratPage.DamageText');

  return (
    <>
      <div className="space-x-1 pr-6">
        <span className={ACTIVE_DAMAGE_OPTION_STYLE}>{t('DamageOption.RaidWide')}</span>
      </div>
      <DamageAmounts damageType={damageType} currentDamage={currentDamage} defaultDamage={defaultDamage} />
    </>
  );
};

const ShareHalfRaidWide = (props: DamageTextProps) => {
  const { damageType, defaultDamage, currentDamage, numShared } = props;

  const { upsertDamageOption, elevated } = useStratSyncStore((state) => state);

  const activeOption = numShared === 3 ? 0 : 1;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-6 min-w-20">
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
        damageType={damageType}
        currentDamage={currentDamage}
        defaultDamage={defaultDamage / (activeOption === 0 ? 4 : 3)}
      />
    </>
  );
};

// This is a fallback component for when the damage type is unknown
const Unknown = () => {
  const t = useTranslations('StratPage.DamageText');

  return <div className="space-x-1 pr-6">{t('DamageOption.Unknown')}</div>;
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
    if (numTargets === 8 && maxShared === 1) return RaidWide;
  }

  return Unknown;
};

export const DamageText = ({
  damages,
}: {
  damages: ArrayElement<Exclude<StrategyDataType['raids'], null>['gimmicks']>['damages'];
}) => {
  const mitigatedDamages = useMitigatedDamages();

  return (
    <>
      {damages.map((damage) => {
        const textProps = {
          damageId: damage.id,
          damageType: damage.type,
          defaultDamage: damage.combined_damage,
          currentDamage: mitigatedDamages[damage.id] ?? damage.combined_damage,
          primaryTarget: damage.strategy_damage_options?.[0]?.primary_target ?? undefined,
          numShared: damage.strategy_damage_options?.[0]?.num_shared ?? undefined,
        };

        const key = `damagetext-${damage.id}`;

        const TextComponent = componentSelector(damage.target, damage.num_targets, damage.max_shared);

        return <TextComponent key={key} {...textProps} />;
      })}
    </>
  );
};
