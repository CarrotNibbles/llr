'use client';
import { useStratSyncStore } from '@/components/providers/StratSyncStoreProvider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useEstimations } from '@/lib/calc/hooks';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

export const StratInfoDialog = ({ className }: { className?: string }) => {
  const { name, raids, version, subversion, strategy_players } = useStratSyncStore((state) => state.strategyData);
  const estimations = useEstimations();
  const t = useTranslations('StratPage.StratHeader.StratInfo');
  const tRaids = useTranslations('Common.Raids');
  const tPatches = useTranslations('Common.FFXIVPatches');

  const playerCount = strategy_players.filter((player) => player.job != null && player.job !== 'LB').length;

  const infos = [
    {
      style: 'col-span-2',
      title: t('StrategyTitle'),
      value: name,
    },
    {
      style: 'col-span-2',
      title: t('Duty'),
      value: tRaids(raids?.semantic_key),
    },
    {
      style: 'col-span-2',
      title: t('FFXIVPatch'),
      value: `${version}.${subversion} - ${tPatches(`${version}.${subversion}`)}`,
    },
    {
      title: t('LevelSync'),
      value: raids?.level,
    },
    {
      title: t('ItemLevelSync'),
      value: raids?.item_level,
    },
    {
      title: t('PlayerCount'),
      value: playerCount,
    },
    {
      title: t('PartyBonus'),
      value: `${Math.round(estimations.partyBonus * 100 - 100)}%`,
    },
    {
      title: t('HPTank'),
      value: estimations.hpTank,
    },
    {
      title: t('HPHealer'),
      value: estimations.hpHealer,
    },
    {
      title: t('HealingTank'),
      value: `${Math.round(estimations.potencyCoefficientTank * 400)}`,
    },
    {
      title: t('HealingHealer'),
      value: `${Math.round(estimations.potencyCoefficientHealer * 400)}`,
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <h3 className={cn(className, 'font-bold cursor-pointer whitespace-nowrap')}>{name}</h3>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('DialogTitle')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-y-2 gap-x-8" style={{ gridTemplateColumns: 'auto auto' }}>
            {infos.map((info) => (
              <div key={info.title} className={cn('flex space-x-2 justify-between', info.style)}>
                <div className="text-muted-foreground">{info.title}</div>
                <div className="font-semibold">{info.value}</div>
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground text-justify">{t('Disclaimer')}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
