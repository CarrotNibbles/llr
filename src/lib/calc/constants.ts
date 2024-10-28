import type {
  FoodParams,
  JobBaseline,
  JobDependentParams,
  LevelDependentParams,
  RegressiveGearStatParams,
  RegressiveWeaponDamageParams,
} from './types';

/*
| Version | Subversion | Max (VIT) | Ratio (VIT) |
| ------- | ---------- | --------- | ----------- |
| 6       | 4          | 143       | 1.1         |
| 7       | 0          | 177       | 1.1         |
*/

export const FOODS: FoodParams[] = [
  {
    available_version: 7,
    available_subversion: 0,
    max_vit_bonus: 177,
    ratio: 1.1,
  },
  {
    available_version: 6,
    available_subversion: 4,
    max_vit_bonus: 143,
    ratio: 1.1,
  },
];

/*
| Level | $B_l^M$ | $B_l^S$ | $\alpha_l$ | $\alpha_l^T$ | $\gamma_l$ | $H_l$ | $\beta_{l}$ | $\beta_{l}^T$ |
| ----- | ------- | ------- | ---------- | ------------ | ---------- | ----- | ----------- | ------------- |
| 70    | 292     | 364     | 125        | 105          | 900        | 1700  | 14          | 18.8          |
| 80    | 340     | 380     | 165        | 115          | 1300       | 2000  | 18.8        | 26.6          |
| 90    | 390     | 400     | 195        | 156          | 1900       | 3000  | 24.3        | 34.6          |
| 100   | 440     | 420     | 237        | 190          | 2780       | 4000  | 30.1        | 43            |
*/

export const LEVEL_DEPENDENT_PARAMS: Record<number, LevelDependentParams> = {
  70: {
    B_M: 292,
    B_S: 364,
    alpha: 125,
    alpha_T: 105,
    gamma: 900,
    H: 1700,
    beta: 14,
    beta_T: 18.8,
  },
  80: {
    B_M: 340,
    B_S: 380,
    alpha: 165,
    alpha_T: 115,
    gamma: 1300,
    H: 2000,
    beta: 18.8,
    beta_T: 26.6,
  },
  90: {
    B_M: 390,
    B_S: 400,
    alpha: 195,
    alpha_T: 156,
    gamma: 1900,
    H: 3000,
    beta: 24.3,
    beta_T: 34.6,
  },
  100: {
    B_M: 440,
    B_S: 420,
    alpha: 237,
    alpha_T: 190,
    gamma: 2780,
    H: 4000,
    beta: 30.1,
    beta_T: 43,
  },
};

/*
| Job  | Aff. Stat | $\eta_j$ | $\mu_j$ | $\nu_j$ |
| ---- | --------- | -------- | ------- | ------- |
| PLD  | STR, TEN  | 140      | 100     | 110     |
| WAR  | STR, TEN  | 145      | 105     | 110     |
| DRK  | STR, TEN  | 140      | 105     | 110     |
| GNB  | STR, TEN  | 140      | 100     | 110     |
| WHM  | MND       | 105      | 115     | 100     |
| SCH  | MND       | 105      | 115     | 100     |
| AST  | MND       | 105      | 115     | 100     |
| SGE  | MND       | 105      | 115     | 100     |
| MNK  | STR       | 110      | 110     | 100     |
| DRG  | STR       | 115      | 115     | 105     |
| NIN  | DEX       | 108      | 110     | 100     |
| SAM  | STR       | 109      | 112     | 100     |
| RPR  | STR       | 115      | 115     | 105     |
| VPR  | DEX       | 111      | 110     | 100     |
| BRD  | DEX       | 105      | 115     | 100     |
| MCH  | DEX       | 105      | 115     | 100     |
| DNC  | DEX       | 105      | 115     | 100     |
| BLM  | INT       | 105      | 115     | 100     |
| SMN  | INT       | 105      | 115     | 100     |
| RDM  | INT       | 105      | 115     | 100     |
| PCT  | INT       | 105      | 115     | 100     |
| BLU  | INT       | 105      | 115     | 100     |
*/

export const JOB_DEPENDENT_PARAMS: Record<JobBaseline, JobDependentParams> = {
  TANK_BASELINE: {
    eta: 140,
    mu: 100,
    nu: 110,
  },
  HEALER_BASELINE: {
    eta: 105,
    mu: 115,
    nu: 100,
  },
};

/*
Main Stat Regressive Gear Stat Parameters
| Level | $\zeta_{l, j}$ | $C_{s, j}$ (Weapon) | $C_{s, j}$ (Major) | $C_{s, j}$ (Minor) | $C_{s, j}$ (Acc.) |
| ----- | -------------- | ------------------- | ------------------ | ------------------ | ----------------- |
| 70    | 0.002545       | 53.36               | 51.46              | 32.38              | 25.54             |
| 80    | 0.002545       | 55.15               | 53.17              | 33.50              | 26.40             |
| 90    | 0.005408       | 11.54               | 11.12              | 7.003              | 5.525             |
| 100   | 0.005236       | 13.36               | 12.87              | 8.113              | 6.393             |
*/

export const MAIN_STAT_GEAR_REGRESSIONS: Record<number, RegressiveGearStatParams> = {
  70: {
    zeta: 0.002545,
    C_weapon: 53.36,
    C_major_piece: 51.46,
    C_minor_piece: 32.38,
    C_accessory: 25.54,
  },
  80: {
    zeta: 0.002545,
    C_weapon: 55.15,
    C_major_piece: 53.17,
    C_minor_piece: 33.5,
    C_accessory: 26.4,
  },
  90: {
    zeta: 0.005408,
    C_weapon: 11.54,
    C_major_piece: 11.12,
    C_minor_piece: 7.003,
    C_accessory: 5.525,
  },
  100: {
    zeta: 0.005236,
    C_weapon: 13.36,
    C_major_piece: 12.87,
    C_minor_piece: 8.113,
    C_accessory: 6.393,
  },
};

/*
Tank VIT Regressive Gear Stat Parameters
| Level | $\zeta_{l, j}$ | $C_{s, j}$ (Weapon) | $C_{s, j}$ (Major) | $C_{s, j}$ (Minor) | $C_{s, j}$ (Acc.) |
| ----- | -------------- | ------------------- | ------------------ | ------------------ | ----------------- |
| 70    | 0.003392       | 40.50               | 39.01              | 24.56              | 19.41             |
| 80    | 0.003133       | 42.47               | 40.91              | 25.74              | 20.29             |
| 90    | 0.006475       | 6.362               | 6.137              | 3.861              | 3.042             |
| 100   | 0.006141       | 7.293               | 7.023              | 4.422              | 3.486             |
*/

export const TANK_VIT_GEAR_REGRESSIONS: Record<number, RegressiveGearStatParams> = {
  70: {
    zeta: 0.003392,
    C_weapon: 40.5,
    C_major_piece: 39.01,
    C_minor_piece: 24.56,
    C_accessory: 19.41,
  },
  80: {
    zeta: 0.003133,
    C_weapon: 42.47,
    C_major_piece: 40.91,
    C_minor_piece: 25.74,
    C_accessory: 20.29,
  },
  90: {
    zeta: 0.006475,
    C_weapon: 6.362,
    C_major_piece: 6.137,
    C_minor_piece: 3.861,
    C_accessory: 3.042,
  },
  100: {
    zeta: 0.006141,
    C_weapon: 7.293,
    C_major_piece: 7.023,
    C_minor_piece: 4.422,
    C_accessory: 3.486,
  },
};

/*
Healer VIT Regressive Gear Stat Parameters
| Level | $\zeta_{l, j}$ | $C_{s, j}$ (Weapon) | $C_{s, j}$ (Major) | $C_{s, j}$ (Minor) | $C_{s, j}$ (Acc.) |
| ----- | -------------- | ------------------- | ------------------ | ------------------ | ----------------- |
| 70    | 0.003384       | 36.55               | 35.21              | 22.15              | 17.54             |
| 80    | 0.003122       | 38.43               | 37.02              | 23.30              | 18.37             |
| 90    | 0.006470       | 5.746               | 5.543              | 3.488              | 2.748             |
| 100   | 0.006141       | 6.560               | 6.319              | 3.975              | 3.136             |
*/

export const HEALER_VIT_GEAR_REGRESSIONS: Record<number, RegressiveGearStatParams> = {
  70: {
    zeta: 0.003384,
    C_weapon: 36.55,
    C_major_piece: 35.21,
    C_minor_piece: 22.15,
    C_accessory: 17.54,
  },
  80: {
    zeta: 0.003122,
    C_weapon: 38.43,
    C_major_piece: 37.02,
    C_minor_piece: 23.3,
    C_accessory: 18.37,
  },
  90: {
    zeta: 0.00647,
    C_weapon: 5.746,
    C_major_piece: 5.543,
    C_minor_piece: 3.488,
    C_accessory: 2.748,
  },
  100: {
    zeta: 0.006141,
    C_weapon: 6.56,
    C_major_piece: 6.319,
    C_minor_piece: 3.975,
    C_accessory: 3.136,
  },
};

/*
Regressive Weapon Damage Parameters
| Level | $A_l$ | $I_l$ |
| ----- | ----- | ----- |
| 70    | 0.1   | 52    |
| 80    | 0.1   | 52    |
| 90    | 0.2   | -1    |
| *100* | *0.2* | *-1*  |
*/

export const WEAPON_DAMAGE_REGRESSIONS: Record<number, RegressiveWeaponDamageParams> = {
  70: {
    A: 0.1,
    I: 52,
  },
  80: {
    A: 0.1,
    I: 52,
  },
  90: {
    A: 0.2,
    I: -1,
  },
  100: {
    A: 0.2,
    I: -1,
  },
};
