import { createStore } from 'zustand';
import type { ActionDataType } from '../queries/server';

export type StaticDataState = {
  actionData?: ActionDataType;
};

export type StaticDataActions = unknown;

export type StaticDataStore = StaticDataState & StaticDataActions;

const defaultState = {};

export const createStaticDataStore = (initState: Partial<StaticDataStore> = {}) =>
  createStore<StaticDataStore>()(() => ({
    ...defaultState,
    ...initState,
  }));
