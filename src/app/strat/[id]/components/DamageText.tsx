'use client';

import { type Database } from '@/lib/database.types';

type DamageTextProps = {
  defaultDamage: number;
  currentDamage: number;
  primaryTarget?: string;
  numShared?: number;
  damageId: string;
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

export const DamageText = ({
  damages,
}: {
  damages: Array<Database['public']['Tables']['damages']['Row']>;
}) => {
  return (
    <>
      <BothTankBuster defaultDamage={180000} currentDamage={100000} damageId={'akcnklsf'} />
    </>
  );
};
