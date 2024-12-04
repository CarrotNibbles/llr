'use client';
import { CustomIcons } from '@/components/icons/CustomIcons';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Toggle } from '@/components/ui/toggle';
import { viewOptionsAtom } from '@/lib/atoms';
import type { Enums } from '@/lib/database.types';
import { cn } from '@/lib/utils/helpers';
import { useAtom } from 'jotai';
import { useTranslations } from 'next-intl';
import { GIMMICK_BACKGROUND_STYLE } from '../../utils/constants';
import { produce } from 'immer';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export const FilterMenu = () => {
  const GimmickTypes: Array<Enums<'gimmick_type'>> = [
    'AutoAttack',
    'Avoidable',
    'Raidwide',
    'Tankbuster',
    'Hybrid',
    'Enrage',
  ];

  const [viewOptions, setViewOptions] = useAtom(viewOptionsAtom);
  const tGimmickType = useTranslations('StratPage.StratHeader.GimmickType');
  const t = useTranslations('StratPage.StratHeader.FilterMenu');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <span className="sr-only select-none">Adjust display filter</span>
          <CustomIcons.filter />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3">
        {/* <div className="flex justify-between">
          <div className="text-xs w-full mb-[2px] ml-1">표시할 공격</div>
          <MixerHorizontalIcon />
        </div>
        <Separator className="mb-[2px]" /> */}
        <div className="flex items-center space-x-2 mb-4 ml-[2px]">
          <Switch
            id="verbose-timeline"
            checked={viewOptions.showVerboseTimeline}
            onCheckedChange={() => setViewOptions(
              produce((draft) => {
                draft.showVerboseTimeline = !draft.showVerboseTimeline;
              }),
            )}
          />
          <Label htmlFor="verbose-timeline">{t('VerboseTimeline')}</Label>
        </div>
        <div className="grid grid-rows-3 grid-cols-2">
          {GimmickTypes.map((gimmickType) => (
            <Toggle
              className="flex justify-start text-start h-7 px-3 m-[2px]"
              aria-label="h"
              key={gimmickType}
              pressed={viewOptions.gimmickTypeFilter[gimmickType]}
              onPressedChange={(pressed) => {
                setViewOptions(
                  produce((draft) => {
                    draft.gimmickTypeFilter[gimmickType] = pressed;
                  }),
                );
              }}
            >
              <div className={cn('rounded-sm mr-2 w-[8px] h-[8px]', GIMMICK_BACKGROUND_STYLE[gimmickType])} />
              <div className="text-xs">{tGimmickType(gimmickType)}</div>
            </Toggle>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};
