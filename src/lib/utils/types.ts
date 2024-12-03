export type NonEmptyArray<T> = [T, ...T[]];
export type ArrayElement<T> = T extends Array<infer R> ? R : never;
export type NullablePartial<T> = { [K in keyof T]?: T[K] | null };

export type Patch = Readonly<{
  version: number;
  subversion: number;
}>;

export type Role = 'Tank' | 'Healer' | 'DPS' | 'Others';
export type DiversedRole = 'Tank' | 'Healer' | 'Ranged' | 'Melee' | 'Caster';
