// @generated by protoc-gen-es v1.8.0 with parameter "target=ts"
// @generated from file stratsync.proto (package stratsync, syntax proto3)
/* eslint-disable */
// @ts-nocheck

import type { BinaryReadOptions, FieldList, JsonReadOptions, JsonValue, PartialMessage, PlainMessage } from "@bufbuild/protobuf";
import { Message, proto3 } from "@bufbuild/protobuf";

/**
 * @generated from message stratsync.SubscriptionRequest
 */
export class SubscriptionRequest extends Message<SubscriptionRequest> {
  /**
   * @generated from field: string strategy = 1;
   */
  strategy = "";

  constructor(data?: PartialMessage<SubscriptionRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.SubscriptionRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "strategy", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): SubscriptionRequest {
    return new SubscriptionRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): SubscriptionRequest {
    return new SubscriptionRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): SubscriptionRequest {
    return new SubscriptionRequest().fromJsonString(jsonString, options);
  }

  static equals(a: SubscriptionRequest | PlainMessage<SubscriptionRequest> | undefined, b: SubscriptionRequest | PlainMessage<SubscriptionRequest> | undefined): boolean {
    return proto3.util.equals(SubscriptionRequest, a, b);
  }
}

/**
 * @generated from message stratsync.DamageOption
 */
export class DamageOption extends Message<DamageOption> {
  /**
   * @generated from field: string damage = 1;
   */
  damage = "";

  /**
   * @generated from field: optional int32 num_shared = 2;
   */
  numShared?: number;

  /**
   * @generated from field: optional string primary_target = 3;
   */
  primaryTarget?: string;

  constructor(data?: PartialMessage<DamageOption>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.DamageOption";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "damage", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "num_shared", kind: "scalar", T: 5 /* ScalarType.INT32 */, opt: true },
    { no: 3, name: "primary_target", kind: "scalar", T: 9 /* ScalarType.STRING */, opt: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DamageOption {
    return new DamageOption().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DamageOption {
    return new DamageOption().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DamageOption {
    return new DamageOption().fromJsonString(jsonString, options);
  }

  static equals(a: DamageOption | PlainMessage<DamageOption> | undefined, b: DamageOption | PlainMessage<DamageOption> | undefined): boolean {
    return proto3.util.equals(DamageOption, a, b);
  }
}

/**
 * @generated from message stratsync.Player
 */
export class Player extends Message<Player> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string job = 2;
   */
  job = "";

  constructor(data?: PartialMessage<Player>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.Player";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "job", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Player {
    return new Player().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Player {
    return new Player().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Player {
    return new Player().fromJsonString(jsonString, options);
  }

  static equals(a: Player | PlainMessage<Player> | undefined, b: Player | PlainMessage<Player> | undefined): boolean {
    return proto3.util.equals(Player, a, b);
  }
}

/**
 * @generated from message stratsync.Entry
 */
export class Entry extends Message<Entry> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  /**
   * @generated from field: string player = 2;
   */
  player = "";

  /**
   * @generated from field: string action = 3;
   */
  action = "";

  /**
   * @generated from field: int32 use_at = 4;
   */
  useAt = 0;

  constructor(data?: PartialMessage<Entry>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.Entry";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "player", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 3, name: "action", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 4, name: "use_at", kind: "scalar", T: 5 /* ScalarType.INT32 */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): Entry {
    return new Entry().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): Entry {
    return new Entry().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): Entry {
    return new Entry().fromJsonString(jsonString, options);
  }

  static equals(a: Entry | PlainMessage<Entry> | undefined, b: Entry | PlainMessage<Entry> | undefined): boolean {
    return proto3.util.equals(Entry, a, b);
  }
}

/**
 * @generated from message stratsync.InitializationEvent
 */
export class InitializationEvent extends Message<InitializationEvent> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: repeated stratsync.Player players = 2;
   */
  players: Player[] = [];

  /**
   * @generated from field: repeated stratsync.DamageOption damage_options = 3;
   */
  damageOptions: DamageOption[] = [];

  /**
   * @generated from field: repeated stratsync.Entry entries = 4;
   */
  entries: Entry[] = [];

  constructor(data?: PartialMessage<InitializationEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.InitializationEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "players", kind: "message", T: Player, repeated: true },
    { no: 3, name: "damage_options", kind: "message", T: DamageOption, repeated: true },
    { no: 4, name: "entries", kind: "message", T: Entry, repeated: true },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InitializationEvent {
    return new InitializationEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InitializationEvent {
    return new InitializationEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InitializationEvent {
    return new InitializationEvent().fromJsonString(jsonString, options);
  }

  static equals(a: InitializationEvent | PlainMessage<InitializationEvent> | undefined, b: InitializationEvent | PlainMessage<InitializationEvent> | undefined): boolean {
    return proto3.util.equals(InitializationEvent, a, b);
  }
}

/**
 * @generated from message stratsync.ElevationRequest
 */
export class ElevationRequest extends Message<ElevationRequest> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: string password = 2;
   */
  password = "";

  constructor(data?: PartialMessage<ElevationRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.ElevationRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "password", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): ElevationRequest {
    return new ElevationRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): ElevationRequest {
    return new ElevationRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): ElevationRequest {
    return new ElevationRequest().fromJsonString(jsonString, options);
  }

  static equals(a: ElevationRequest | PlainMessage<ElevationRequest> | undefined, b: ElevationRequest | PlainMessage<ElevationRequest> | undefined): boolean {
    return proto3.util.equals(ElevationRequest, a, b);
  }
}

/**
 * @generated from message stratsync.UpsertDamageOptionRequest
 */
export class UpsertDamageOptionRequest extends Message<UpsertDamageOptionRequest> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: stratsync.DamageOption damage_option = 2;
   */
  damageOption?: DamageOption;

  constructor(data?: PartialMessage<UpsertDamageOptionRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.UpsertDamageOptionRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "damage_option", kind: "message", T: DamageOption },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpsertDamageOptionRequest {
    return new UpsertDamageOptionRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpsertDamageOptionRequest {
    return new UpsertDamageOptionRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpsertDamageOptionRequest {
    return new UpsertDamageOptionRequest().fromJsonString(jsonString, options);
  }

  static equals(a: UpsertDamageOptionRequest | PlainMessage<UpsertDamageOptionRequest> | undefined, b: UpsertDamageOptionRequest | PlainMessage<UpsertDamageOptionRequest> | undefined): boolean {
    return proto3.util.equals(UpsertDamageOptionRequest, a, b);
  }
}

/**
 * @generated from message stratsync.UpsertEntryRequest
 */
export class UpsertEntryRequest extends Message<UpsertEntryRequest> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: stratsync.Entry entry = 2;
   */
  entry?: Entry;

  constructor(data?: PartialMessage<UpsertEntryRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.UpsertEntryRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "entry", kind: "message", T: Entry },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpsertEntryRequest {
    return new UpsertEntryRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpsertEntryRequest {
    return new UpsertEntryRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpsertEntryRequest {
    return new UpsertEntryRequest().fromJsonString(jsonString, options);
  }

  static equals(a: UpsertEntryRequest | PlainMessage<UpsertEntryRequest> | undefined, b: UpsertEntryRequest | PlainMessage<UpsertEntryRequest> | undefined): boolean {
    return proto3.util.equals(UpsertEntryRequest, a, b);
  }
}

/**
 * @generated from message stratsync.DeleteEntryRequest
 */
export class DeleteEntryRequest extends Message<DeleteEntryRequest> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: string id = 2;
   */
  id = "";

  constructor(data?: PartialMessage<DeleteEntryRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.DeleteEntryRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteEntryRequest {
    return new DeleteEntryRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteEntryRequest {
    return new DeleteEntryRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteEntryRequest {
    return new DeleteEntryRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteEntryRequest | PlainMessage<DeleteEntryRequest> | undefined, b: DeleteEntryRequest | PlainMessage<DeleteEntryRequest> | undefined): boolean {
    return proto3.util.equals(DeleteEntryRequest, a, b);
  }
}

/**
 * @generated from message stratsync.InsertPlayerRequest
 */
export class InsertPlayerRequest extends Message<InsertPlayerRequest> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: stratsync.Player player = 2;
   */
  player?: Player;

  constructor(data?: PartialMessage<InsertPlayerRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.InsertPlayerRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "player", kind: "message", T: Player },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InsertPlayerRequest {
    return new InsertPlayerRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InsertPlayerRequest {
    return new InsertPlayerRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InsertPlayerRequest {
    return new InsertPlayerRequest().fromJsonString(jsonString, options);
  }

  static equals(a: InsertPlayerRequest | PlainMessage<InsertPlayerRequest> | undefined, b: InsertPlayerRequest | PlainMessage<InsertPlayerRequest> | undefined): boolean {
    return proto3.util.equals(InsertPlayerRequest, a, b);
  }
}

/**
 * @generated from message stratsync.DeletePlayerRequest
 */
export class DeletePlayerRequest extends Message<DeletePlayerRequest> {
  /**
   * @generated from field: string token = 1;
   */
  token = "";

  /**
   * @generated from field: string id = 2;
   */
  id = "";

  constructor(data?: PartialMessage<DeletePlayerRequest>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.DeletePlayerRequest";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "token", kind: "scalar", T: 9 /* ScalarType.STRING */ },
    { no: 2, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeletePlayerRequest {
    return new DeletePlayerRequest().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeletePlayerRequest {
    return new DeletePlayerRequest().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeletePlayerRequest {
    return new DeletePlayerRequest().fromJsonString(jsonString, options);
  }

  static equals(a: DeletePlayerRequest | PlainMessage<DeletePlayerRequest> | undefined, b: DeletePlayerRequest | PlainMessage<DeletePlayerRequest> | undefined): boolean {
    return proto3.util.equals(DeletePlayerRequest, a, b);
  }
}

/**
 * @generated from message stratsync.UpsertDamageOptionEvent
 */
export class UpsertDamageOptionEvent extends Message<UpsertDamageOptionEvent> {
  /**
   * @generated from field: stratsync.DamageOption damage_option = 1;
   */
  damageOption?: DamageOption;

  constructor(data?: PartialMessage<UpsertDamageOptionEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.UpsertDamageOptionEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "damage_option", kind: "message", T: DamageOption },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpsertDamageOptionEvent {
    return new UpsertDamageOptionEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpsertDamageOptionEvent {
    return new UpsertDamageOptionEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpsertDamageOptionEvent {
    return new UpsertDamageOptionEvent().fromJsonString(jsonString, options);
  }

  static equals(a: UpsertDamageOptionEvent | PlainMessage<UpsertDamageOptionEvent> | undefined, b: UpsertDamageOptionEvent | PlainMessage<UpsertDamageOptionEvent> | undefined): boolean {
    return proto3.util.equals(UpsertDamageOptionEvent, a, b);
  }
}

/**
 * @generated from message stratsync.UpsertEntryEvent
 */
export class UpsertEntryEvent extends Message<UpsertEntryEvent> {
  /**
   * @generated from field: stratsync.Entry entry = 1;
   */
  entry?: Entry;

  constructor(data?: PartialMessage<UpsertEntryEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.UpsertEntryEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "entry", kind: "message", T: Entry },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): UpsertEntryEvent {
    return new UpsertEntryEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): UpsertEntryEvent {
    return new UpsertEntryEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): UpsertEntryEvent {
    return new UpsertEntryEvent().fromJsonString(jsonString, options);
  }

  static equals(a: UpsertEntryEvent | PlainMessage<UpsertEntryEvent> | undefined, b: UpsertEntryEvent | PlainMessage<UpsertEntryEvent> | undefined): boolean {
    return proto3.util.equals(UpsertEntryEvent, a, b);
  }
}

/**
 * @generated from message stratsync.DeleteEntryEvent
 */
export class DeleteEntryEvent extends Message<DeleteEntryEvent> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<DeleteEntryEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.DeleteEntryEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeleteEntryEvent {
    return new DeleteEntryEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeleteEntryEvent {
    return new DeleteEntryEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeleteEntryEvent {
    return new DeleteEntryEvent().fromJsonString(jsonString, options);
  }

  static equals(a: DeleteEntryEvent | PlainMessage<DeleteEntryEvent> | undefined, b: DeleteEntryEvent | PlainMessage<DeleteEntryEvent> | undefined): boolean {
    return proto3.util.equals(DeleteEntryEvent, a, b);
  }
}

/**
 * @generated from message stratsync.InsertPlayerEvent
 */
export class InsertPlayerEvent extends Message<InsertPlayerEvent> {
  /**
   * @generated from field: stratsync.Player player = 1;
   */
  player?: Player;

  constructor(data?: PartialMessage<InsertPlayerEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.InsertPlayerEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "player", kind: "message", T: Player },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): InsertPlayerEvent {
    return new InsertPlayerEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): InsertPlayerEvent {
    return new InsertPlayerEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): InsertPlayerEvent {
    return new InsertPlayerEvent().fromJsonString(jsonString, options);
  }

  static equals(a: InsertPlayerEvent | PlainMessage<InsertPlayerEvent> | undefined, b: InsertPlayerEvent | PlainMessage<InsertPlayerEvent> | undefined): boolean {
    return proto3.util.equals(InsertPlayerEvent, a, b);
  }
}

/**
 * @generated from message stratsync.DeletePlayerEvent
 */
export class DeletePlayerEvent extends Message<DeletePlayerEvent> {
  /**
   * @generated from field: string id = 1;
   */
  id = "";

  constructor(data?: PartialMessage<DeletePlayerEvent>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.DeletePlayerEvent";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "id", kind: "scalar", T: 9 /* ScalarType.STRING */ },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): DeletePlayerEvent {
    return new DeletePlayerEvent().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): DeletePlayerEvent {
    return new DeletePlayerEvent().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): DeletePlayerEvent {
    return new DeletePlayerEvent().fromJsonString(jsonString, options);
  }

  static equals(a: DeletePlayerEvent | PlainMessage<DeletePlayerEvent> | undefined, b: DeletePlayerEvent | PlainMessage<DeletePlayerEvent> | undefined): boolean {
    return proto3.util.equals(DeletePlayerEvent, a, b);
  }
}

/**
 * @generated from message stratsync.EventResponse
 */
export class EventResponse extends Message<EventResponse> {
  /**
   * @generated from oneof stratsync.EventResponse.event
   */
  event: {
    /**
     * @generated from field: stratsync.InitializationEvent initialization_event = 1;
     */
    value: InitializationEvent;
    case: "initializationEvent";
  } | {
    /**
     * @generated from field: stratsync.UpsertDamageOptionEvent upsert_damage_option_event = 2;
     */
    value: UpsertDamageOptionEvent;
    case: "upsertDamageOptionEvent";
  } | {
    /**
     * @generated from field: stratsync.UpsertEntryEvent upsert_entry_event = 3;
     */
    value: UpsertEntryEvent;
    case: "upsertEntryEvent";
  } | {
    /**
     * @generated from field: stratsync.DeleteEntryEvent delete_entry_event = 4;
     */
    value: DeleteEntryEvent;
    case: "deleteEntryEvent";
  } | {
    /**
     * @generated from field: stratsync.InsertPlayerEvent insert_player_event = 5;
     */
    value: InsertPlayerEvent;
    case: "insertPlayerEvent";
  } | {
    /**
     * @generated from field: stratsync.DeletePlayerEvent delete_player_event = 6;
     */
    value: DeletePlayerEvent;
    case: "deletePlayerEvent";
  } | { case: undefined; value?: undefined } = { case: undefined };

  constructor(data?: PartialMessage<EventResponse>) {
    super();
    proto3.util.initPartial(data, this);
  }

  static readonly runtime: typeof proto3 = proto3;
  static readonly typeName = "stratsync.EventResponse";
  static readonly fields: FieldList = proto3.util.newFieldList(() => [
    { no: 1, name: "initialization_event", kind: "message", T: InitializationEvent, oneof: "event" },
    { no: 2, name: "upsert_damage_option_event", kind: "message", T: UpsertDamageOptionEvent, oneof: "event" },
    { no: 3, name: "upsert_entry_event", kind: "message", T: UpsertEntryEvent, oneof: "event" },
    { no: 4, name: "delete_entry_event", kind: "message", T: DeleteEntryEvent, oneof: "event" },
    { no: 5, name: "insert_player_event", kind: "message", T: InsertPlayerEvent, oneof: "event" },
    { no: 6, name: "delete_player_event", kind: "message", T: DeletePlayerEvent, oneof: "event" },
  ]);

  static fromBinary(bytes: Uint8Array, options?: Partial<BinaryReadOptions>): EventResponse {
    return new EventResponse().fromBinary(bytes, options);
  }

  static fromJson(jsonValue: JsonValue, options?: Partial<JsonReadOptions>): EventResponse {
    return new EventResponse().fromJson(jsonValue, options);
  }

  static fromJsonString(jsonString: string, options?: Partial<JsonReadOptions>): EventResponse {
    return new EventResponse().fromJsonString(jsonString, options);
  }

  static equals(a: EventResponse | PlainMessage<EventResponse> | undefined, b: EventResponse | PlainMessage<EventResponse> | undefined): boolean {
    return proto3.util.equals(EventResponse, a, b);
  }
}

