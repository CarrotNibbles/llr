export type JobBaseline = 'TANK_BASELINE' | 'HEALER_BASELINE';

export type FoodParams = {
  available_version: number;
  available_subversion: number;
  max_vit_bonus: number;
  ratio: number;
};

export type LevelDependentParams = {
  B_M: number;
  B_S: number;
  alpha: number;
  alpha_T: number;
  gamma: number;
  H: number;
  beta: number;
  beta_T: number;
};

export type JobDependentParams = {
  eta: number;
  mu: number;
  nu: number;
};

export type RegressiveGearStatParams = {
  zeta: number;
  C_weapon: number;
  C_major_piece: number;
  C_minor_piece: number;
  C_accessory: number;
};

export type RegressiveWeaponDamageParams = {
  A: number;
  I: number;
};
