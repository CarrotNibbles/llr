import { useStaticDataStore } from '@/components/providers/StaticDataStoreProvider';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { OrderedSet } from '@js-sdsl/ordered-set';
import { ElementType, useMemo } from 'react';
import type { Tables } from '../database.types';
import { type ArrayElement, type Role, getDiversedRole, getRole } from '../utils';
import { estimateAll } from './estimations';

export const useTank: () => [string, string] = () => {
  const {
    strategyData: { strategy_players },
  } = useStratSyncStore((state) => state);

  const playerIds = strategy_players.map((player) => player.id);

  return [playerIds[0], playerIds[1]];
};

export const useEstimations = () => {
  const { strategyData } = useStratSyncStore((state) => state);

  const itemLevel = strategyData.raids?.item_level;
  const level = strategyData.raids?.level;
  const version = strategyData.version;
  const subversion = strategyData.subversion;
  const num_diverse_roles = new Set(
    strategyData.strategy_players
      .map(({ job }) => (job && job !== 'LB' ? getDiversedRole(job) : null))
      .filter((role) => role),
  ).size;

  if (itemLevel === undefined || level === undefined) {
    throw new Error('itemLevel and level must be defined');
  }

  return estimateAll(itemLevel, level, version, subversion, num_diverse_roles);
};

type Effect = {
  physical: number;
  magical: number;
  barrier: number;
  invuln: number;
  activeAmp: number;
  passiveAmp: number;
};

const IDENTITY_EFFECT: Effect = {
  physical: 1,
  magical: 1,
  barrier: 0,
  invuln: 0,
  activeAmp: 1,
  passiveAmp: 1,
};

const addEffect = (lhs: Effect, rhs: Effect): Effect => ({
  physical: lhs.physical * rhs.physical,
  magical: lhs.magical * rhs.magical,
  barrier: lhs.barrier + rhs.barrier,
  invuln: lhs.invuln + rhs.invuln,
  activeAmp: lhs.activeAmp * rhs.activeAmp,
  passiveAmp: lhs.passiveAmp * rhs.passiveAmp,
});

const inverseEffect = (effect: Effect): Effect => ({
  physical: 1 / effect.physical,
  magical: 1 / effect.magical,
  barrier: -effect.barrier,
  invuln: -effect.invuln,
  activeAmp: 1 / effect.activeAmp,
  passiveAmp: 1 / effect.passiveAmp,
});

const resolveDamage = (
  damage: number,
  type: Tables<'damages'>['type'],
  activeEffect: Effect,
): { absorbed: number; remaining: number } => {
  let absorbed = 0;
  let remaining = damage;

  if (activeEffect.invuln > 0) {
    return { absorbed: 0, remaining: 0 };
  }

  if (type === 'Physical') remaining *= activeEffect.physical;
  if (type === 'Magical') remaining *= activeEffect.magical;

  remaining = Math.round(remaining);

  absorbed += Math.min(remaining, activeEffect.barrier);
  remaining -= absorbed;

  return { absorbed, remaining };
};

const semanticKeyTransform = (key: string): string => {
  const HEALER_BASIC_BARRIERS = [
    'succor',
    'concitation',
    'deployment_tactics',
    'eukrasian_prognosis',
    'eukrasian_prognosis_ii',
  ];

  const RANGED_PARTY_MITIGATION = ['troubadour', 'tactician', 'shield_samba'];

  if (HEALER_BASIC_BARRIERS.includes(key)) {
    return 'healer_basic_barrier';
  }

  if (RANGED_PARTY_MITIGATION.includes(key)) {
    return 'ranged_party_mitigation';
  }

  return key;
};

export const useMitigatedDamages = () => {
  type DamageApplied = {
    id: string;
    combined_damage: number;
    num_shared: number;
    num_targets: number;
    primary_target: string | null;
    target: Tables<'damages'>['target'];
    type: Tables<'damages'>['type'];
  };

  type DamageTimeline = {
    at: number;
    damageApplied: DamageApplied;
  };

  type MitigationTimeline = {
    at: number;
    by: string;
    via: string;
    role: Role;
    gcd: boolean;
    mitigation: Tables<'mitigations'>;
  };

  type TimelineType =
    | ({ type: 'DAMAGE_PREPARE' } & DamageTimeline)
    | ({ type: 'MITIGATION_ACQUIRE' } & MitigationTimeline);

  type ActiveEffectSet = OrderedSet<{ at: number; effect: Effect }>;
  type ActiveEffectSetIterator = ReturnType<ActiveEffectSet['begin']>;

  const { actionData } = useStaticDataStore((state) => state);
  const [mainTank, offTank] = useTank();
  const { strategyData } = useStratSyncStore((state) => state);
  const { hpHealer, hpTank, potencyCoefficientHealer, potencyCoefficientTank } = useEstimations();
  const actionRecord = useMemo(() => {
    const record: Record<string, ArrayElement<typeof actionData>> = {};
    for (const action of actionData ?? []) {
      record[action.id] = action;
    }
    return record;
  }, [actionData]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  return useMemo(() => {
    const playerIds = strategyData.strategy_players.map((player) => player.id);

    const timeline: TimelineType[] = [];

    for (const gimmick of strategyData.raids?.gimmicks ?? []) {
      for (const damage of gimmick.damages) {
        const damageApplied = {
          id: damage.id,
          combined_damage: damage.combined_damage,
          num_shared: damage.strategy_damage_options?.[0]?.num_shared ?? damage.max_shared,
          num_targets: damage.num_targets,
          primary_target: damage.strategy_damage_options?.[0]?.primary_target,
          target: damage.target,
          type: damage.type,
        };

        if (
          damageApplied.primary_target === null &&
          gimmick.type === 'Tankbuster' &&
          damageApplied.num_targets === 1 &&
          damageApplied.num_shared === 1
        ) {
          damageApplied.primary_target = mainTank;
        }

        timeline.push({ type: 'DAMAGE_PREPARE', at: gimmick.prepare_at, damageApplied });
      }
    }

    for (const player of strategyData.strategy_players) {
      for (const entry of player.strategy_player_entries) {
        if (player.job === null) {
          throw new Error('ERROR: Job must be defined');
        }

        const job = player.job;
        const gcd = actionRecord[entry.action].is_gcd;
        const mitigations = actionRecord[entry.action].mitigations;
        const semanticKey = semanticKeyTransform(actionRecord[entry.action].semantic_key);

        mitigations.forEach((mitigation, index) => {
          timeline.push({
            type: 'MITIGATION_ACQUIRE',
            at: entry.use_at,
            by: player.id,
            via: `${semanticKey}.${index}`,
            role: getRole(job),
            gcd,
            mitigation,
          });
        });
      }
    }

    timeline.sort((lhs, rhs) => lhs.at - rhs.at);

    const effectComparator = (lhs: { at: number; effect: Effect }, rhs: { at: number; effect: Effect }) => {
      const compares = [
        lhs.at - rhs.at,
        lhs.effect.physical - rhs.effect.physical,
        lhs.effect.magical - rhs.effect.magical,
        lhs.effect.barrier - rhs.effect.barrier,
        lhs.effect.invuln - rhs.effect.invuln,
        lhs.effect.activeAmp - rhs.effect.activeAmp,
        lhs.effect.passiveAmp - rhs.effect.passiveAmp,
      ];

      for (const compare of compares) {
        if (compare !== 0) {
          return compare;
        }
      }

      return 0;
    };
    const activePersonalEffects: Record<string, ActiveEffectSet> = Object.fromEntries(
      playerIds.map((playerId) => [playerId, new OrderedSet<{ at: number; effect: Effect }>([], effectComparator)]),
    );
    const activeRaidwideEffects = new OrderedSet<{ at: number; effect: Effect }>([], effectComparator);

    const effectIteratorMapPersonal = Object.fromEntries(
      playerIds.map((playerId) => [playerId, new Map<string, ActiveEffectSetIterator>()]),
    );
    const effectIteratorMapRaidwide = new Map<string, ActiveEffectSetIterator>();

    const personalEffect: Record<string, Effect> = Object.fromEntries(
      playerIds.map((playerId) => [playerId, IDENTITY_EFFECT]),
    );
    let raidwideEffect = IDENTITY_EFFECT;

    const mitigatedDamages: Record<string, number> = {};

    for (const timelineEntry of timeline) {
      const gainEffect = (
        expire_at: number,
        effect: Effect,
        activeEffectSet: ActiveEffectSet,
        effectCumulated: Effect,
        effectIteratorMap: Map<string, ActiveEffectSetIterator>,
        via: string,
      ) => {
        let resultEffect = effectCumulated;

        let activeEffect = IDENTITY_EFFECT;
        const activeEffectIterator = effectIteratorMap.get(via);
        if (activeEffectIterator?.isAccessible()) {
          activeEffect = activeEffectIterator.pointer.effect;
        }

        if (
          activeEffect.physical < effect.physical ||
          activeEffect.magical < effect.magical ||
          activeEffect.barrier > effect.barrier ||
          activeEffect.invuln > effect.invuln ||
          activeEffect.activeAmp > effect.activeAmp ||
          activeEffect.passiveAmp > effect.passiveAmp
        ) {
          // update not occurs for the weaker effect
          return resultEffect;
        }

        resultEffect = addEffect(resultEffect, inverseEffect(activeEffect));
        if (activeEffectIterator?.isAccessible()) {
          activeEffectSet.eraseElementByIterator(activeEffectIterator);
        }

        resultEffect = addEffect(resultEffect, effect);
        activeEffectSet.insert({ at: expire_at, effect });

        const insertedIterator = activeEffectSet.find({ at: expire_at, effect });
        if (insertedIterator) {
          effectIteratorMap.set(via, insertedIterator);
        }

        return resultEffect;
      };

      const removeExpiredEffects = (activeEffectSet: ActiveEffectSet, effectCumulated: Effect) => {
        let resultEffect = effectCumulated;

        while (true) {
          const frontIterator = activeEffectSet.begin();

          if (frontIterator.equals(activeEffectSet.end()) || frontIterator.pointer.at > timelineEntry.at) {
            break;
          }

          resultEffect = addEffect(resultEffect, inverseEffect(frontIterator.pointer.effect));
          activeEffectSet.eraseElementByIterator(frontIterator);
        }

        return resultEffect;
      };

      for (const playerId of playerIds) {
        personalEffect[playerId] = removeExpiredEffects(activePersonalEffects[playerId], personalEffect[playerId]);
      }
      raidwideEffect = removeExpiredEffects(activeRaidwideEffects, raidwideEffect);

      const handleAbsorption = (activeEffectSet: ActiveEffectSet, absorbed: number, effect: Effect) => {
        let remainingAbsorption = absorbed;

        const iter = activeEffectSet.begin();
        while (!iter.equals(activeEffectSet.end()) && remainingAbsorption > 0) {
          const current = iter.pointer;

          if (current.effect.barrier > 0) {
            const absorption = Math.min(remainingAbsorption, current.effect.barrier);
            remainingAbsorption -= absorption;
            current.effect.barrier -= absorption;
          }

          iter.next();
        }

        if (remainingAbsorption > 0) {
          throw new Error(`ERROR: Damage absorbed more than barrier, remaining: ${remainingAbsorption}`);
        }

        return {
          ...effect,
          barrier: effect.barrier - absorbed,
        };
      };

      if (timelineEntry.type === 'DAMAGE_PREPARE') {
        const { damageApplied } = timelineEntry;

        if (damageApplied.target === 'Tankbuster') {
          let mainTankDamage: number;
          let offTankDamage: number;

          if (damageApplied.num_targets === 2) {
            mainTankDamage = damageApplied.combined_damage / 2;
            offTankDamage = damageApplied.combined_damage / 2;
          } else {
            if (damageApplied.num_shared === 2) {
              mainTankDamage = damageApplied.combined_damage / 2;
              offTankDamage = damageApplied.combined_damage / 2;
            } else {
              if (damageApplied.primary_target === mainTank) {
                mainTankDamage = damageApplied.combined_damage;
                offTankDamage = 0;
              } else {
                mainTankDamage = 0;
                offTankDamage = damageApplied.combined_damage;
              }
            }
          }

          const raidwideEffectWithoutBarrier = { ...raidwideEffect, barrier: 0 };

          const mainTankResult = resolveDamage(
            mainTankDamage,
            damageApplied.type,
            addEffect(personalEffect[mainTank], raidwideEffectWithoutBarrier),
          );
          const offTankResult = resolveDamage(
            offTankDamage,
            damageApplied.type,
            addEffect(personalEffect[offTank], raidwideEffectWithoutBarrier),
          );

          mitigatedDamages[damageApplied.id] = Math.max(mainTankResult.remaining, offTankResult.remaining);

          personalEffect[mainTank] = handleAbsorption(
            activePersonalEffects[mainTank],
            mainTankResult.absorbed,
            personalEffect[mainTank],
          );
          personalEffect[offTank] = handleAbsorption(
            activePersonalEffects[offTank],
            offTankResult.absorbed,
            personalEffect[offTank],
          );
        }

        if (damageApplied.target === 'Raidwide') {
          const raidwideResult = resolveDamage(
            damageApplied.combined_damage / damageApplied.num_shared,
            damageApplied.type,
            raidwideEffect,
          );

          mitigatedDamages[damageApplied.id] = raidwideResult.remaining;

          raidwideEffect = handleAbsorption(activeRaidwideEffects, raidwideResult.absorbed, raidwideEffect);
        }
      }

      if (timelineEntry.type === 'MITIGATION_ACQUIRE') {
        const { rate, potency, type, is_raidwide, duration } = timelineEntry.mitigation;
        const potencyCoefficient = timelineEntry.role === 'Tank' ? potencyCoefficientTank : potencyCoefficientHealer;
        const baselineHP = timelineEntry.role === 'Tank' && !is_raidwide ? hpTank : hpHealer;

        const { gcd } = timelineEntry;
        const subjectEffect = addEffect(raidwideEffect, personalEffect[timelineEntry.by]);
        const objectEffect = addEffect(
          raidwideEffect,
          is_raidwide ? IDENTITY_EFFECT : personalEffect[timelineEntry.by],
        );
        const amplification = (gcd ? subjectEffect.activeAmp : 1) * objectEffect.passiveAmp;

        let effect: Effect = IDENTITY_EFFECT;
        if (type === 'Physical') {
          effect = {
            ...IDENTITY_EFFECT,
            physical: rate ?? 1,
          };
        }
        if (type === 'Magical') {
          effect = {
            ...IDENTITY_EFFECT,
            magical: rate ?? 1,
          };
        }
        if (type === 'Barrier') {
          const rateBarrier = (rate ?? 0) * baselineHP;
          const potencyBarrier = (potency ?? 0) * potencyCoefficient * amplification;

          effect = {
            ...IDENTITY_EFFECT,
            barrier: Math.round(potencyBarrier + rateBarrier),
          };
        }
        if (type === 'Invuln') {
          effect = {
            ...IDENTITY_EFFECT,
            invuln: 1,
          };
        }
        if (type === 'ActiveAmp') {
          effect = {
            ...IDENTITY_EFFECT,
            activeAmp: rate ?? 1,
          };
        }
        if (type === 'PassiveAmp') {
          effect = {
            ...IDENTITY_EFFECT,
            passiveAmp: rate ?? 1,
          };
        }

        if (is_raidwide) {
          raidwideEffect = gainEffect(
            timelineEntry.at + duration,
            effect,
            activeRaidwideEffects,
            raidwideEffect,
            effectIteratorMapRaidwide,
            timelineEntry.via,
          );
        } else {
          personalEffect[timelineEntry.by] = gainEffect(
            timelineEntry.at + duration,
            effect,
            activePersonalEffects[timelineEntry.by],
            personalEffect[timelineEntry.by],
            effectIteratorMapPersonal[timelineEntry.by],
            timelineEntry.via,
          );
        }
      }
    }

    return mitigatedDamages;
  }, [strategyData]);
};
