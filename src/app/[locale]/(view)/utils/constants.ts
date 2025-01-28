import type { SortOption } from './types';

export const DEFAULT_LIMIT = 10;
export const SEARCH_BUTTON_LIMIT = 5;
export const SEARCH_BUTTON_MOBILE_LIMIT = 3;
export const PAGINATION_OFFSET = 2;
export const PAGINATION_TOTAL_PAGE = PAGINATION_OFFSET * 2 + 1;

export const Q_PARAM = 'q';
export const PAGE_PARAM = 'page';
export const LIMIT_PARAM = 'limit';
export const SORT_PARAM = 'sort';
export const RAID_PARAM = 'raid';
export const PATCH_PARAM = 'patch';
export const JOBS_PARAM = 'jobs';
export const AUTHORED_PARAM = 'authored';
export const LIKED_PARAM = 'liked';

export const NAV_RAID_CATEGORIES = ['Savage', 'Ultimate'] as const;
export const ALL_RAIG_CATEGORIES = ['Savage', 'Ultimate', 'Trial', 'Raid', 'Dungeon'] as const;

export const ALL_SORT_OPTIONS = ['like', 'recent'] as const;

export const DEFAULT_SORT: SortOption = 'like';
