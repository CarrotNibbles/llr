'use client';

import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import type { StrategyDataType } from '@/lib/queries/server';
import { cn, getRawRole, type ArrayElement } from '@/lib/utils';

type DamageTextProps = {
  damageId: string;
  defaultDamage: number;
  currentDamage: number;
  primaryTarget?: string;
  numShared?: number;
};

const useTank: () => [string, string] | [string, undefined] | [undefined, undefined] = () => {
  const {
    strategyData: { strategy_players },
  } = useStratSyncStore((state) => state);

  const tanks = strategy_players
    .filter((player) => player.job && getRawRole(player.job) === 'Tank')
    .map((player) => player.id);

  if (tanks.length === 0) return [undefined, undefined];
  if (tanks.length === 1) return [tanks[0], undefined];
  return [tanks[0], tanks[1]];
};

const ACTIVE_OPTION_STYLE = 'font-bold';
const INACTIVE_OPTION_STYLE = 'text-muted-foreground text-xs';

const BothTankBuster = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage } = props;

  return (
    <>
      <div className="space-x-1 pr-6">
        <span className={ACTIVE_OPTION_STYLE}>T1+T2</span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const SingleTankBuster = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage, primaryTarget } = props;

  const [mainTank, offTank] = useTank();
  const { upsertDamageOption, elevated } = useStratSyncStore((state) => state);

  const activeOption = primaryTarget === offTank ? 1 : 0;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-6 min-w-16">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 0 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
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
          className={cn(activeOption === 1 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
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
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const ShareTankBuster = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage, primaryTarget } = props;

  const [mainTank, offTank] = useTank();
  const { upsertDamageOption, elevated } = useStratSyncStore((state) => state);

  const activeOption = primaryTarget === undefined ? 0 : primaryTarget === mainTank ? 1 : 2;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-6 min-w-28">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 0 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 0) return;

            upsertDamageOption(
              {
                damage: props.damageId,
              },
              false,
            );
          }}
        >
          T1+T2
        </span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 1 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 1) return;

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
          className={cn(activeOption === 2 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 2) return;

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
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const ShareAllRaidWide = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        <span className={ACTIVE_OPTION_STYLE}>쉐어</span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const RaidWide = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        <span className={ACTIVE_OPTION_STYLE}>광역</span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const ShareHalfRaidWide = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage, numShared } = props;

  const { upsertDamageOption, elevated } = useStratSyncStore((state) => state);

  const activeOption = numShared === 3 ? 0 : 1;
  const cursorStyle = elevated ? 'cursor-pointer' : 'cursor-not-allowed';

  return (
    <>
      <div className="space-x-1 pr-6 min-w-20">
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 0 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 0) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                numShared: 3,
              },
              false,
            );
          }}
        >
          4+4
        </span>
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
        <span
          className={cn(activeOption === 1 ? ACTIVE_OPTION_STYLE : INACTIVE_OPTION_STYLE, cursorStyle)}
          onClick={() => {
            if (activeOption === 1) return;

            upsertDamageOption(
              {
                damage: props.damageId,
                numShared: 4,
              },
              false,
            );
          }}
        >
          3+5
        </span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

// This is a fallback component for when the damage type is unknown
const Unknown = () => <div className="space-x-1 pr-6">머지 버그인듯</div>;

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
  return (
    <>
      {damages.map((damage) => {
        const textProps = {
          damageId: damage.id,
          defaultDamage: damage.combined_damage,
          currentDamage: 90000,
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
