export const weightedCompareFunction =
  <ValueType>(
    compareFn1: (item1: ValueType, item2: ValueType) => number,
    compareFn2: (item1: ValueType, item2: ValueType) => number,
  ) =>
  (item1: ValueType, item2: ValueType): number =>
    compareFn1(item1, item2) === 0 ? compareFn2(item1, item2) : compareFn1(item1, item2);
