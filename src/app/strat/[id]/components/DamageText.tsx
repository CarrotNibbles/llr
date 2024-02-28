'use client';

import { type Tables } from '@/lib/database.types';

type DamageTextProps = {
  defaultDamage: number;
  currentDamage: number;
  primaryTarget?: string;
  numShared?: number;
};

const BothTankBuster = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        <span
          className="font-bold pointer-events-auto"
          onClick={() => {
            console.log('clicked');
          }}
        >
          T1+T2
        </span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const SingleTankBuster = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage, primaryTarget } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        {primaryTarget === 'T2' ? (
          <>
            <span className="text-muted-foreground">T1</span>
            <span className="font-bold">T2</span>
          </>
        ) : (
          <>
            <span className="font-bold">T1</span>
            <span className="text-muted-foreground">T2</span>
          </>
        )}
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const ShareTankBuster = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage, primaryTarget } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        {primaryTarget === null ? (
          <>
            <span className="font-bold">T1+T2</span>
            <span className="text-muted-foreground">T1</span>
            <span className="text-muted-foreground">T2</span>
          </>
        ) : primaryTarget === 'T1' ? (
          <>
            <span className="text-muted-foreground">T1+T2</span>
            <span className="font-bold">T1</span>
            <span className="text-muted-foreground">T2</span>
          </>
        ) : (
          <>
            <span className="text-muted-foreground">T1+T2</span>
            <span className="text-muted-foreground">T1</span>
            <span className="font-bold">T2</span>
          </>
        )}
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const ShareAllRaidWide = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        <span className="font-bold">쉐어</span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const RaidWide = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        <span className="font-bold">전체</span>
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const ShareHalfRaidWide = (props: DamageTextProps) => {
  const { defaultDamage, currentDamage, numShared } = props;
  return (
    <>
      <div className="space-x-1 pr-6">
        {numShared === 3 ? (
          <>
            <span className="text-muted-foreground">4+4</span>
            <span className="font-bold">3+5</span>
          </>
        ) : (
          <>
            <span className="font-bold">4+4</span>
            <span className="text-muted-foreground">3+5</span>
          </>
        )}
      </div>
      <span className="tabular-nums font-bold">{currentDamage}</span>
      <span className="text-muted-foreground tabular-nums text-xs my-auto">{defaultDamage}</span>
    </>
  );
};

const Unknown = () => <div className="space-x-1 pr-6">머지 버그인듯</div>;

export const DamageText = ({ damages }: { damages: Array<Tables<'damages'>> }) => {
  return (
    <>
      {damages.map((damage) => {
        if (damage.target === 'Tankbuster') {
          if (damage.num_targets === 1 && damage.max_shared === 1)
            return (
              <SingleTankBuster key={damage.id} defaultDamage={100000} currentDamage={90000} />
            );
          if (damage.num_targets === 1 && damage.max_shared === 2)
            return <ShareTankBuster key={damage.id} defaultDamage={100000} currentDamage={90000} />;
          if (damage.num_targets === 2)
            return <BothTankBuster key={damage.id} defaultDamage={100000} currentDamage={90000} />;
          return <Unknown key={damage.id} />;
        }

        if (damage.target === 'Raidwide') {
          if (damage.num_targets === 1 && damage.max_shared === 8)
            return (
              <ShareAllRaidWide key={damage.id} defaultDamage={110000} currentDamage={90000} />
            );
          if (damage.num_targets === 2 && damage.max_shared === 4)
            return (
              <ShareHalfRaidWide key={damage.id} defaultDamage={100000} currentDamage={90000} />
            );
          if (damage.num_targets === 8 && damage.max_shared === 1)
            return <RaidWide key={damage.id} defaultDamage={100000} currentDamage={900000} />;

          return <Unknown key={damage.id} />;
        }

        return <Unknown key={damage.id} />;
      })}
    </>
  );
};
