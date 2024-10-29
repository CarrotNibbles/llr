import type { Enums } from '@/lib/database.types';
import type { Role } from '@/lib/utils';

export const columnWidth = 'w-6 lg:w-6';
export const jobIconWidth = 'w-8 lg:w-8';

export const TIME_STEP = 1;

export const COUNTDOWN_DURATION = 1800;

export const BOTTOM_PADDING_PX = 60;

export const ROLE_ICON_STYLE = {
  Tank: 'fill-blue-600 dark:fill-blue-400 border-blue-600 dark:border-blue-400',
  Healer: 'fill-green-600 dark:fill-green-400 border-green-600 dark:border-green-400',
  DPS: 'fill-red-600 dark:fill-red-400 border-red-600 dark:border-red-400',
  Others: 'fill-zinc-600 dark:fill-zinc-400 border-zinc-600 dark:border-zinc-400',
} satisfies Record<Role, string>;

export const GIMMICK_TEXT_STYLE = {
  AutoAttack: 'text-zinc-500',
  Raidwide: 'text-blue-600 dark:text-blue-400',
  Tankbuster: 'text-rose-600 dark:text-rose-400',
  Hybrid: 'text-violet-600 dark:text-violet-400',
  Avoidable: 'text-green-600 dark:text-green-400',
  Enrage: 'text-zinc-900 dark:text-zinc-100',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const GIMMICK_BORDER_STYLE = {
  AutoAttack: 'border-zinc-500',
  Raidwide: 'border-blue-600 dark:border-blue-400',
  Tankbuster: 'border-rose-600 dark:border-rose-400',
  Hybrid: 'border-violet-600 dark:border-violet-400',
  Avoidable: 'border-green-600 dark:border-green-400',
  Enrage: 'border-zinc-900 dark:border-zinc-100',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const GIMMICK_BACKGROUND_STYLE = {
  AutoAttack: 'bg-zinc-500',
  Raidwide: 'bg-blue-600 dark:bg-blue-400',
  Tankbuster: 'bg-rose-600 dark:bg-rose-400',
  Hybrid: 'bg-violet-600 dark:bg-violet-400',
  Avoidable: 'bg-green-600 dark:bg-green-400',
  Enrage: 'bg-zinc-900 dark:bg-zinc-100',
} satisfies Record<Enums<'gimmick_type'>, string>;

export const MERGE_THRESHOLD_DEFAULT = 28;
export const MERGE_THRESHOLD_INCREMENTAL = 20;

export const BOX_X_OFFSET = [0, 5, -5, 10, -10];
export const BOX_Z_INDEX = [3, 4, 5, 6, 7];

export const MAX_DISPLAY_COUNT = 3;

export const ACTIVE_DAMAGE_OPTION_STYLE = 'font-bold';
export const INACTIVE_DAMAGE_OPTION_STYLE = 'text-muted-foreground text-xs';
