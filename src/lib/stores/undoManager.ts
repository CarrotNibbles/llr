import type { PlainMessage } from '@bufbuild/protobuf';
import { LinkList } from '@js-sdsl/link-list';
import type { Tables } from '../database.types';
import type { Entry, Note } from '../proto/stratsync_pb';
import type { StrategyDataType } from '../queries/server';
import type { ArrayElement } from '../utils';

export type NoteMutation =
  | {
      upsert: PlainMessage<Note>;
    }
  | {
      delete: string;
    };

function inverseNoteMutation(mut: NoteMutation, currentNotes: Tables<'notes'>[]): NoteMutation {
  if ('upsert' in mut) {
    const existingNote = currentNotes.find((n) => n.id === mut.upsert.id);

    if (existingNote) {
      return { upsert: existingNote };
    }

    return { delete: mut.upsert.id };
  }
  const existingNote = currentNotes.find((n) => n.id === mut.delete);

  if (existingNote) {
    return { upsert: existingNote };
  }

  throw new Error(`Note with id ${mut.delete} not found`);
}

export type EntryMutation = {
  upserts: PlainMessage<Entry>[];
  deletes: string[];
};

function inverseEntryMutation(
  { upserts, deletes }: EntryMutation,
  currentEntries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'],
): EntryMutation {
  const invertedUpserts: PlainMessage<Entry>[] = [];
  const invertedDeletes: string[] = [];

  for (const entry of upserts) {
    const existingEntry = currentEntries.find((e) => e.id === entry.id);
    if (existingEntry) {
      invertedUpserts.push({
        action: existingEntry.action,
        id: existingEntry.id,
        player: existingEntry.player,
        useAt: existingEntry.use_at,
      });
    } else {
      invertedDeletes.push(entry.id);
    }
  }

  for (const id of deletes) {
    const existingEntry = currentEntries.find((e) => e.id === id);
    if (existingEntry) {
      invertedUpserts.push({
        action: existingEntry.action,
        id: existingEntry.id,
        player: existingEntry.player,
        useAt: existingEntry.use_at,
      });
    }
  }

  return {
    upserts: invertedUpserts,
    deletes: invertedDeletes,
  };
}

export type UndoableMutation =
  | {
      type: 'entry';
      mutation: EntryMutation;
    }
  | {
      type: 'note';
      mutation: NoteMutation;
    };

export type UndoableHistory =
  | {
      type: 'entry';
      forward: EntryMutation;
      backward: EntryMutation;
    }
  | {
      type: 'note';
      forward: NoteMutation;
      backward: NoteMutation;
    };

const pickForward = (history: UndoableHistory | undefined): UndoableMutation | undefined => {
  if (!history) return undefined;

  if (history.type === 'entry') {
    return { type: 'entry', mutation: history.forward };
  }
  return { type: 'note', mutation: history.forward };
};

const pickBackward = (history: UndoableHistory | undefined): UndoableMutation | undefined => {
  if (!history) return undefined;

  if (history.type === 'entry') {
    return { type: 'entry', mutation: history.backward };
  }
  return { type: 'note', mutation: history.backward };
};

export class UndoManager {
  static MAX_HISTORY_CAPACITY = 256;

  private past: LinkList<UndoableHistory> = new LinkList();
  private future: LinkList<UndoableHistory> = new LinkList();

  undo(): UndoableMutation | undefined {
    const history = this.past.popBack();

    if (history) this.future.pushFront(history);

    return pickBackward(history);
  }

  redo(): UndoableMutation | undefined {
    const history = this.future.popFront();

    if (history) this.past.pushBack(history);

    return pickForward(history);
  }

  lockEntries(ids: string[]): void {
    const lockedEntries = new Set(ids);

    for (const { type, forward, backward } of this.past) {
      if (type === 'entry') {
        forward.upserts = forward.upserts.filter((entry) => !lockedEntries.has(entry.id));
        forward.deletes = forward.deletes.filter((id) => !lockedEntries.has(id));
        backward.upserts = backward.upserts.filter((entry) => !lockedEntries.has(entry.id));
        backward.deletes = backward.deletes.filter((id) => !lockedEntries.has(id));
      }
    }

    for (const { type, forward, backward } of this.future) {
      if (type === 'entry') {
        forward.upserts = forward.upserts.filter((entry) => !lockedEntries.has(entry.id));
        forward.deletes = forward.deletes.filter((id) => !lockedEntries.has(id));
        backward.upserts = backward.upserts.filter((entry) => !lockedEntries.has(entry.id));
        backward.deletes = backward.deletes.filter((id) => !lockedEntries.has(id));
      }
    }
  }

  ensureCapacity(): void {
    if (this.future.size() > UndoManager.MAX_HISTORY_CAPACITY) {
      throw new Error('Future history is too large');
    }

    while (this.past.size() + this.future.size() > UndoManager.MAX_HISTORY_CAPACITY) this.past.popFront();
  }

  pushEntryMutation(
    mutation: EntryMutation,
    currentEntries: ArrayElement<StrategyDataType['strategy_players']>['strategy_player_entries'],
  ): void {
    this.past.pushBack({
      type: 'entry',
      forward: mutation,
      backward: inverseEntryMutation(mutation, currentEntries),
    });

    this.future.clear();

    this.ensureCapacity();
  }

  pushNoteMutation(mutation: NoteMutation, currentNotes: Tables<'notes'>[]): void {
    this.past.pushBack({
      type: 'note',
      forward: mutation,
      backward: inverseNoteMutation(mutation, currentNotes),
    });

    this.future.clear();

    this.ensureCapacity();
  }

  isUndoAvailable(): boolean {
    return this.past.size() > 0;
  }

  isRedoAvailable(): boolean {
    return this.future.size() > 0;
  }
}
