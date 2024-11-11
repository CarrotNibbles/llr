import { clamp } from '@/lib/utils';
import { OrderedSet } from '@js-sdsl/ordered-set';
import { BOTTOM_PADDING_PX, COUNTDOWN_DURATION, TIME_STEP } from './constants';

export const yToTime = (y: number, pixelPerFrame: number, raidDuration: number) =>
  Math.round((clamp(y / pixelPerFrame, 0, raidDuration + COUNTDOWN_DURATION) - COUNTDOWN_DURATION) / TIME_STEP) *
  TIME_STEP;

export const yToTimeUnclamped = (y: number, pixelPerFrame: number) =>
  Math.round((y / pixelPerFrame - COUNTDOWN_DURATION) / TIME_STEP) * TIME_STEP;

export const timeToY = (time: number, pixelPerFrame: number) => (time + COUNTDOWN_DURATION) * pixelPerFrame;

export const getAreaHeight = (pixelPerFrame: number, raidDuration: number) =>
  timeToY(raidDuration, pixelPerFrame) + BOTTOM_PADDING_PX;

export const weightedCompareFunction =
  <ValueType>(
    compareFn1: (item1: ValueType, item2: ValueType) => number,
    compareFn2: (item1: ValueType, item2: ValueType) => number,
  ) =>
  (item1: ValueType, item2: ValueType): number =>
    compareFn1(item1, item2) === 0 ? compareFn2(item1, item2) : compareFn1(item1, item2);

export const blockOffsetToXFactory = (editColumnWidths: number[]) => (block: number, offset: number) => {
  const clampedBlock = clamp(block, 1, 9);
  const clampedOffset = clamp(offset, 0, 1);

  let horizontalPosition = 1;
  for (let idx = 0; idx < clampedBlock - 1; idx++) {
    horizontalPosition += editColumnWidths[idx];
  }
  horizontalPosition += editColumnWidths[clampedBlock - 1] * clampedOffset;

  return horizontalPosition;
};

export const xToBlockOffsetFactory = (editColumnWidths: number[]) => (x: number) => {
  let clampedX = clamp(x - 1, 0);

  let block = 1;
  while (block < 9 && clampedX > editColumnWidths[block - 1]) {
    clampedX -= editColumnWidths[block - 1];
    block++;
  }

  let offset = clampedX / editColumnWidths[block - 1];

  if (offset > 1) offset = 1;

  return { block, offset };
};

export class MultiIntervalSet {
  intervalSets: OrderedSet<[number, number]>[] = [];
  multiplicity = 0;

  constructor(multiplicity: number, intervals: [number, number][] = []) {
    const comparator = (lhs: [number, number], rhs: [number, number]) => {
      return lhs[0] - rhs[0] === 0 ? lhs[1] - rhs[1] : lhs[0] - rhs[0];
    };

    this.multiplicity = multiplicity;

    this.intervalSets.push(new OrderedSet([], comparator));
    this.intervalSets[0].insert([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]);
    for (let i = 0; i < multiplicity; i++) {
      this.intervalSets.push(new OrderedSet([], comparator));
    }

    const intervalsEvt = intervals
      .flatMap(([s, e]) => [
        [s, 1],
        [e, -1],
      ])
      .toSorted((lhs, rhs) => lhs[0] - rhs[0]);

    let currentMultiplicity = 0;
    let cursor = 0;
    let lastAt: number | null = null;

    while (cursor < intervalsEvt.length) {
      let [at, delta] = intervalsEvt[cursor];
      cursor++;

      while (cursor < intervalsEvt.length && at === intervalsEvt[cursor][0]) {
        delta += intervalsEvt[cursor][1];
        cursor++;
      }

      if (lastAt !== null) {
        if (currentMultiplicity > this.multiplicity) {
          throw new Error('Invalid input');
        }

        this.intervalSets[currentMultiplicity].insert([lastAt, at], this.intervalSets[currentMultiplicity].end());
      }

      currentMultiplicity += delta;
      lastAt = at;
    }
  }

  partition(idx: number, at: number) {
    let it = this.intervalSets[idx].lowerBound([at, Number.POSITIVE_INFINITY]);

    if (it.equals(this.intervalSets[idx].begin())) {
      return;
    }

    it.pre();

    if (it.pointer[0] === at) {
      return;
    }

    const interval = it.pointer;
    it = this.intervalSets[idx].eraseElementByIterator(it);

    this.intervalSets[idx].insert([interval[0], at], it);
    this.intervalSets[idx].insert([at, interval[1]], it);
  }

  merge(idx: number, at: number) {
    let it = this.intervalSets[idx].lowerBound([at, Number.POSITIVE_INFINITY]);

    if (it.equals(this.intervalSets[idx].begin())) {
      return;
    }

    it.pre();

    if (it.pointer[0] !== at || it.equals(this.intervalSets[idx].begin())) {
      return;
    }

    it.pre();

    if (it.pointer[1] !== at) {
      return;
    }

    const s = it.pointer[0];
    it = this.intervalSets[idx].eraseElementByIterator(it);
    const e = it.pointer[1];
    it = this.intervalSets[idx].eraseElementByIterator(it);

    this.intervalSets[idx].insert([s, e], it);
  }

  isInsertable(interval: [number, number]) {
    const it = this.intervalSets[this.multiplicity].lowerBound([interval[0], Number.POSITIVE_INFINITY]);

    if (!it.equals(this.intervalSets[this.multiplicity].end()) && it.pointer[0] < interval[1]) {
      return false;
    }

    if (!it.equals(this.intervalSets[this.multiplicity].begin())) {
      it.pre();

      if (interval[0] < it.pointer[1]) {
        return false;
      }
    }

    return true;
  }

  insertInterval(interval: [number, number]) {
    if (!this.isInsertable(interval)) {
      return false;
    }

    let intervalsPassed: [number, number][] = [];

    for (let mul = 0; mul <= this.multiplicity; mul++) {
      const intervalsToPass: [number, number][] = [];

      this.partition(mul, interval[0]);
      this.partition(mul, interval[1]);

      let it = this.intervalSets[mul].lowerBound([interval[0], -1]);

      while (!it.equals(this.intervalSets[mul].end()) && it.pointer[1] <= interval[1]) {
        intervalsToPass.push(it.pointer);
        it = this.intervalSets[mul].eraseElementByIterator(it);
      }

      for (const passed of intervalsPassed) {
        this.intervalSets[mul].insert(passed, it);
      }

      this.merge(mul, interval[0]);
      this.merge(mul, interval[1]);

      intervalsPassed = intervalsToPass;
    }

    return true;
  }

  offsetSearch(interval: [number, number], offset: number) {
    if (this.isInsertable([interval[0] + offset, interval[1] + offset])) return offset;

    if (offset === 0) {
      throw new Error('reset position is not possible');
    }

    if (offset < 0) {
      const it = this.intervalSets[this.multiplicity].lowerBound([interval[0], Number.POSITIVE_INFINITY]);

      if (!it.equals(this.intervalSets[this.multiplicity].begin())) it.pre();

      while (true) {
        const nextIt = it.copy();
        nextIt.next();

        if (
          nextIt.equals(this.intervalSets[this.multiplicity].end()) ||
          nextIt.pointer[0] - it.pointer[1] >= interval[1] - interval[0]
        ) {
          const resultOffset = it.pointer[1] - interval[0];

          if (resultOffset < offset) continue;

          if (resultOffset * offset < 0) {
            throw new Error('reset position is not possible');
          }

          return resultOffset;
        }

        it.next();
      }
    } else {
      const it = this.intervalSets[this.multiplicity].lowerBound([interval[0], Number.POSITIVE_INFINITY]);

      while (true) {
        if (it.equals(this.intervalSets[this.multiplicity].begin())) {
          const resultOffset = it.pointer[0] - interval[1];

          if (resultOffset * offset < 0) {
            throw new Error('reset position is not possible');
          }

          return resultOffset;
        }

        const prevIt = it.copy();
        prevIt.pre();

        if (it.pointer[0] - prevIt.pointer[1] >= interval[1] - interval[0]) {
          const resultOffset = it.pointer[0] - interval[1];

          if (resultOffset > offset) continue;

          if (resultOffset * offset < 0) {
            throw new Error('reset position is not possible');
          }

          return resultOffset;
        }

        it.pre();
      }
    }
  }
}
