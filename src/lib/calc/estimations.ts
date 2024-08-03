import {
  FOODS,
  HEALER_VIT_GEAR_REGRESSIONS,
  JOB_DEPENDENT_PARAMS,
  LEVEL_DEPENDENT_PARAMS,
  MAIN_STAT_GEAR_REGRESSIONS,
  TANK_VIT_GEAR_REGRESSIONS,
  WEAPON_DAMAGE_REGRESSIONS,
} from './constants';
import type { JobBaseline, RegressiveGearStatParams } from './types';

const checkLevelValidity = (level: number): void => {
  if (![70, 80, 90, 100].includes(level)) {
    throw new Error(`Invalid level: ${level}`);
  }
};

export const estimateHP = (vit: number, level: number, job: JobBaseline): number => {
  checkLevelValidity(level);

  const { H, B_M, beta, beta_T } = LEVEL_DEPENDENT_PARAMS[level];
  const { eta } = JOB_DEPENDENT_PARAMS[job];
  const beta_j = job === 'TANK_BASELINE' ? beta_T : beta;

  return Math.floor((H * eta) / 100) + Math.floor((vit - B_M) * beta_j);
};

export const estimateMainStatMultiplier = (mainStat: number, level: number, job: JobBaseline): number => {
  checkLevelValidity(level);

  const { B_M, alpha, alpha_T } = LEVEL_DEPENDENT_PARAMS[level];
  const alpha_j = job === 'TANK_BASELINE' ? alpha_T : alpha;

  return 1 + 0.01 * Math.floor((mainStat / B_M - 1) * alpha_j);
};

export const estimateWeaponDamageMultiplier = (weaponDamage: number, level: number, job: JobBaseline): number => {
  checkLevelValidity(level);

  const { B_M } = LEVEL_DEPENDENT_PARAMS[level];
  const { mu } = JOB_DEPENDENT_PARAMS[job];

  return 0.01 * (weaponDamage + Math.floor((B_M * mu) / 1000));
};

export const estimateSubStatMultiplier = (job: JobBaseline): number => {
  return job === 'TANK_BASELINE' ? 1.13 : 1.12;
};

export const estimateBaseMainStat = (level: number, job: JobBaseline): number => {
  checkLevelValidity(level);

  const { B_M } = LEVEL_DEPENDENT_PARAMS[level];
  const { mu } = JOB_DEPENDENT_PARAMS[job];

  return Math.floor((B_M * mu) / 100);
};

export const estimateBaseVIT = (level: number, job: JobBaseline): number => {
  checkLevelValidity(level);

  const { B_S } = LEVEL_DEPENDENT_PARAMS[level];
  const { nu } = JOB_DEPENDENT_PARAMS[job];

  return Math.floor((B_S * nu) / 100);
};

export const aggreagateRegressiveGearStatParams = (params: RegressiveGearStatParams): { zeta: number; C: number } => {
  const { zeta, C_weapon, C_major_piece, C_minor_piece, C_accessory } = params;

  return {
    zeta,
    C: C_weapon + C_major_piece * 2 + C_minor_piece * 3 + C_accessory * 5,
  };
};

export const estimateGearMainStat = (itemLevel: number, level: number): number => {
  checkLevelValidity(level);

  const { zeta, C } = aggreagateRegressiveGearStatParams(MAIN_STAT_GEAR_REGRESSIONS[level]);

  return C * Math.exp(zeta * itemLevel);
};

export const estimateGearVIT = (itemLevel: number, level: number, job: JobBaseline): number => {
  checkLevelValidity(level);

  const { zeta, C } = aggreagateRegressiveGearStatParams(
    (job === 'TANK_BASELINE' ? TANK_VIT_GEAR_REGRESSIONS : HEALER_VIT_GEAR_REGRESSIONS)[level],
  );

  return C * Math.exp(zeta * itemLevel);
};

export const estimateWeaponDamage = (itemLevel: number, level: number): number => {
  checkLevelValidity(level);

  const { A, I } = WEAPON_DAMAGE_REGRESSIONS[level];

  return Math.ceil(A * itemLevel + I);
};

export const applyFoodBonus = (vit: number, version: number, subversion: number) => {
  for (const { available_version, available_subversion, max_vit_bonus, ratio } of FOODS) {
    if ((version === available_version && subversion >= available_subversion) || version > available_version) {
      return Math.min(vit + max_vit_bonus, Math.floor(vit * ratio));
    }
  }

  return vit;
};

export const estimatePartyBonus = (num_diverse_roles: number): number => {
  return 1 + 0.01 * num_diverse_roles;
};

export const estimateAll = (
  itemLevel: number,
  level: number,
  version: number,
  subversion: number,
  num_diverse_roles: number,
) => {
  const partyBonus = estimatePartyBonus(num_diverse_roles);

  const weaponDamage = estimateWeaponDamage(itemLevel, level);

  const mainStatHealer = estimateGearMainStat(itemLevel, level) + estimateBaseMainStat(level, 'HEALER_BASELINE');
  const mainStatTank = estimateGearMainStat(itemLevel, level) + estimateBaseMainStat(level, 'TANK_BASELINE');

  const mainStatHealerOL = mainStatHealer * partyBonus;
  const mainStatTankOL = mainStatTank * partyBonus;

  const vitHealer = estimateGearVIT(itemLevel, level, 'HEALER_BASELINE') + estimateBaseVIT(level, 'HEALER_BASELINE');
  const vitTank = estimateGearVIT(itemLevel, level, 'TANK_BASELINE') + estimateBaseVIT(level, 'TANK_BASELINE');

  const vitHealerWithFood = applyFoodBonus(vitHealer, version, subversion);
  const vitTankWithFood = applyFoodBonus(vitTank, version, subversion);

  const vitHealerOL = vitHealerWithFood * partyBonus;
  const vitTankOL = vitTankWithFood * partyBonus;

  const hpHealer = estimateHP(vitHealerOL, level, 'HEALER_BASELINE');
  const hpTank = estimateHP(vitTankOL, level, 'TANK_BASELINE');

  const mainStatMultiplierHealer = estimateMainStatMultiplier(mainStatHealerOL, level, 'HEALER_BASELINE');
  const mainStatMultiplierTank = estimateMainStatMultiplier(mainStatTankOL, level, 'TANK_BASELINE');

  const weaponDamageMultiplierHealer = estimateWeaponDamageMultiplier(weaponDamage, level, 'HEALER_BASELINE');
  const weaponDamageMultiplierTank = estimateWeaponDamageMultiplier(weaponDamage, level, 'TANK_BASELINE');

  const subStatMultiplierHealer = estimateSubStatMultiplier('HEALER_BASELINE');
  const subStatMultiplierTank = estimateSubStatMultiplier('TANK_BASELINE');

  const potencyCoefficientHealer = mainStatMultiplierHealer * weaponDamageMultiplierHealer * subStatMultiplierHealer;
  const potencyCoefficientTank = mainStatMultiplierTank * weaponDamageMultiplierTank * subStatMultiplierTank;

  return {
    partyBonus,
    hpHealer,
    hpTank,
    potencyCoefficientHealer,
    potencyCoefficientTank,
  };
};
