import type { Enums } from '../database.types';
import type { Patch } from './types';

export const PATCH_REGEX = /^[234567]\.[012345]$/;

// biome-ignore format: job array too long
export const ALL_SELECTABLE_JOBS = [
  'PLD', 'WAR', 'DRK', 'GNB',
  'WHM', 'SCH', 'AST', 'SGE',
  'MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR',
  'BRD', 'MCH', 'DNC',
  'BLM', 'SMN', 'RDM', 'PCT',
] as const;
/* prettier-ignore-end */

export const JOB_LAYOUT = [
  ['PLD', 'WAR', 'DRK', 'GNB'],
  ['WHM', 'SCH', 'AST', 'SGE'],
  ['MNK', 'DRG', 'NIN', 'SAM', 'RPR', 'VPR'],
  ['BRD', 'MCH', 'DNC'],
  ['BLM', 'SMN', 'RDM', 'PCT'],
  [null],
] satisfies (Enums<'job'> | null)[][];

export const ALL_PATCHES = [
  { version: 2, subversion: 0 },
  { version: 2, subversion: 1 },
  { version: 2, subversion: 2 },
  { version: 2, subversion: 3 },
  { version: 2, subversion: 4 },
  { version: 2, subversion: 5 },
  { version: 3, subversion: 0 },
  { version: 3, subversion: 1 },
  { version: 3, subversion: 2 },
  { version: 3, subversion: 3 },
  { version: 3, subversion: 4 },
  { version: 3, subversion: 5 },
  { version: 4, subversion: 0 },
  { version: 4, subversion: 1 },
  { version: 4, subversion: 2 },
  { version: 4, subversion: 3 },
  { version: 4, subversion: 4 },
  { version: 4, subversion: 5 },
  { version: 5, subversion: 0 },
  { version: 5, subversion: 1 },
  { version: 5, subversion: 2 },
  { version: 5, subversion: 3 },
  { version: 5, subversion: 4 },
  { version: 5, subversion: 5 },
  { version: 6, subversion: 0 },
  { version: 6, subversion: 1 },
  { version: 6, subversion: 2 },
  { version: 6, subversion: 3 },
  { version: 6, subversion: 4 },
  { version: 6, subversion: 5 },
  { version: 7, subversion: 0 },
  { version: 7, subversion: 1 },
] as const satisfies Patch[];
