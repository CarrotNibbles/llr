// package: stratsync
// file: stratsync.proto

/* tslint:disable */
/* eslint-disable */

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class SubscriptionRequest extends jspb.Message { 
    getSession(): string;
    setSession(value: string): SubscriptionRequest;
    getStrategy(): string;
    setStrategy(value: string): SubscriptionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): SubscriptionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: SubscriptionRequest): SubscriptionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: SubscriptionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): SubscriptionRequest;
    static deserializeBinaryFromReader(message: SubscriptionRequest, reader: jspb.BinaryReader): SubscriptionRequest;
}

export namespace SubscriptionRequest {
    export type AsObject = {
        session: string,
        strategy: string,
    }
}

export class DamageOption extends jspb.Message { 
    getDamage(): string;
    setDamage(value: string): DamageOption;

    hasNumShared(): boolean;
    clearNumShared(): void;
    getNumShared(): number | undefined;
    setNumShared(value: number): DamageOption;

    hasPrimaryTarget(): boolean;
    clearPrimaryTarget(): void;
    getPrimaryTarget(): string | undefined;
    setPrimaryTarget(value: string): DamageOption;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DamageOption.AsObject;
    static toObject(includeInstance: boolean, msg: DamageOption): DamageOption.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DamageOption, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DamageOption;
    static deserializeBinaryFromReader(message: DamageOption, reader: jspb.BinaryReader): DamageOption;
}

export namespace DamageOption {
    export type AsObject = {
        damage: string,
        numShared?: number,
        primaryTarget?: string,
    }
}

export class Player extends jspb.Message { 
    getId(): string;
    setId(value: string): Player;
    getJob(): string;
    setJob(value: string): Player;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Player.AsObject;
    static toObject(includeInstance: boolean, msg: Player): Player.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Player, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Player;
    static deserializeBinaryFromReader(message: Player, reader: jspb.BinaryReader): Player;
}

export namespace Player {
    export type AsObject = {
        id: string,
        job: string,
    }
}

export class Entry extends jspb.Message { 
    getId(): string;
    setId(value: string): Entry;
    getPlayer(): string;
    setPlayer(value: string): Entry;
    getAbility(): string;
    setAbility(value: string): Entry;
    getUseAt(): number;
    setUseAt(value: number): Entry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Entry.AsObject;
    static toObject(includeInstance: boolean, msg: Entry): Entry.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Entry, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Entry;
    static deserializeBinaryFromReader(message: Entry, reader: jspb.BinaryReader): Entry;
}

export namespace Entry {
    export type AsObject = {
        id: string,
        player: string,
        ability: string,
        useAt: number,
    }
}

export class InitializationEvent extends jspb.Message { 
    getToken(): string;
    setToken(value: string): InitializationEvent;
    clearPlayersList(): void;
    getPlayersList(): Array<Player>;
    setPlayersList(value: Array<Player>): InitializationEvent;
    addPlayers(value?: Player, index?: number): Player;
    clearDamageOptionsList(): void;
    getDamageOptionsList(): Array<DamageOption>;
    setDamageOptionsList(value: Array<DamageOption>): InitializationEvent;
    addDamageOptions(value?: DamageOption, index?: number): DamageOption;
    clearEntriesList(): void;
    getEntriesList(): Array<Entry>;
    setEntriesList(value: Array<Entry>): InitializationEvent;
    addEntries(value?: Entry, index?: number): Entry;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InitializationEvent.AsObject;
    static toObject(includeInstance: boolean, msg: InitializationEvent): InitializationEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InitializationEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InitializationEvent;
    static deserializeBinaryFromReader(message: InitializationEvent, reader: jspb.BinaryReader): InitializationEvent;
}

export namespace InitializationEvent {
    export type AsObject = {
        token: string,
        playersList: Array<Player.AsObject>,
        damageOptionsList: Array<DamageOption.AsObject>,
        entriesList: Array<Entry.AsObject>,
    }
}

export class UpsertDamageOptionRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): UpsertDamageOptionRequest;

    hasDamageOption(): boolean;
    clearDamageOption(): void;
    getDamageOption(): DamageOption | undefined;
    setDamageOption(value?: DamageOption): UpsertDamageOptionRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpsertDamageOptionRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UpsertDamageOptionRequest): UpsertDamageOptionRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpsertDamageOptionRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpsertDamageOptionRequest;
    static deserializeBinaryFromReader(message: UpsertDamageOptionRequest, reader: jspb.BinaryReader): UpsertDamageOptionRequest;
}

export namespace UpsertDamageOptionRequest {
    export type AsObject = {
        token: string,
        damageOption?: DamageOption.AsObject,
    }
}

export class UpsertEntryRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): UpsertEntryRequest;

    hasEntry(): boolean;
    clearEntry(): void;
    getEntry(): Entry | undefined;
    setEntry(value?: Entry): UpsertEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpsertEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: UpsertEntryRequest): UpsertEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpsertEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpsertEntryRequest;
    static deserializeBinaryFromReader(message: UpsertEntryRequest, reader: jspb.BinaryReader): UpsertEntryRequest;
}

export namespace UpsertEntryRequest {
    export type AsObject = {
        token: string,
        entry?: Entry.AsObject,
    }
}

export class DeleteEntryRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): DeleteEntryRequest;
    getId(): string;
    setId(value: string): DeleteEntryRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteEntryRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteEntryRequest): DeleteEntryRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteEntryRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteEntryRequest;
    static deserializeBinaryFromReader(message: DeleteEntryRequest, reader: jspb.BinaryReader): DeleteEntryRequest;
}

export namespace DeleteEntryRequest {
    export type AsObject = {
        token: string,
        id: string,
    }
}

export class InsertPlayerRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): InsertPlayerRequest;

    hasPlayer(): boolean;
    clearPlayer(): void;
    getPlayer(): Player | undefined;
    setPlayer(value?: Player): InsertPlayerRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InsertPlayerRequest.AsObject;
    static toObject(includeInstance: boolean, msg: InsertPlayerRequest): InsertPlayerRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InsertPlayerRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InsertPlayerRequest;
    static deserializeBinaryFromReader(message: InsertPlayerRequest, reader: jspb.BinaryReader): InsertPlayerRequest;
}

export namespace InsertPlayerRequest {
    export type AsObject = {
        token: string,
        player?: Player.AsObject,
    }
}

export class DeletePlayerRequest extends jspb.Message { 
    getToken(): string;
    setToken(value: string): DeletePlayerRequest;
    getId(): string;
    setId(value: string): DeletePlayerRequest;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeletePlayerRequest.AsObject;
    static toObject(includeInstance: boolean, msg: DeletePlayerRequest): DeletePlayerRequest.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeletePlayerRequest, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeletePlayerRequest;
    static deserializeBinaryFromReader(message: DeletePlayerRequest, reader: jspb.BinaryReader): DeletePlayerRequest;
}

export namespace DeletePlayerRequest {
    export type AsObject = {
        token: string,
        id: string,
    }
}

export class UpsertDamageOptionEvent extends jspb.Message { 

    hasDamageOption(): boolean;
    clearDamageOption(): void;
    getDamageOption(): DamageOption | undefined;
    setDamageOption(value?: DamageOption): UpsertDamageOptionEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpsertDamageOptionEvent.AsObject;
    static toObject(includeInstance: boolean, msg: UpsertDamageOptionEvent): UpsertDamageOptionEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpsertDamageOptionEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpsertDamageOptionEvent;
    static deserializeBinaryFromReader(message: UpsertDamageOptionEvent, reader: jspb.BinaryReader): UpsertDamageOptionEvent;
}

export namespace UpsertDamageOptionEvent {
    export type AsObject = {
        damageOption?: DamageOption.AsObject,
    }
}

export class UpsertEntryEvent extends jspb.Message { 

    hasEntry(): boolean;
    clearEntry(): void;
    getEntry(): Entry | undefined;
    setEntry(value?: Entry): UpsertEntryEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): UpsertEntryEvent.AsObject;
    static toObject(includeInstance: boolean, msg: UpsertEntryEvent): UpsertEntryEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: UpsertEntryEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): UpsertEntryEvent;
    static deserializeBinaryFromReader(message: UpsertEntryEvent, reader: jspb.BinaryReader): UpsertEntryEvent;
}

export namespace UpsertEntryEvent {
    export type AsObject = {
        entry?: Entry.AsObject,
    }
}

export class DeleteEntryEvent extends jspb.Message { 
    getId(): string;
    setId(value: string): DeleteEntryEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeleteEntryEvent.AsObject;
    static toObject(includeInstance: boolean, msg: DeleteEntryEvent): DeleteEntryEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeleteEntryEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeleteEntryEvent;
    static deserializeBinaryFromReader(message: DeleteEntryEvent, reader: jspb.BinaryReader): DeleteEntryEvent;
}

export namespace DeleteEntryEvent {
    export type AsObject = {
        id: string,
    }
}

export class InsertPlayerEvent extends jspb.Message { 

    hasPlayer(): boolean;
    clearPlayer(): void;
    getPlayer(): Player | undefined;
    setPlayer(value?: Player): InsertPlayerEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): InsertPlayerEvent.AsObject;
    static toObject(includeInstance: boolean, msg: InsertPlayerEvent): InsertPlayerEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: InsertPlayerEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): InsertPlayerEvent;
    static deserializeBinaryFromReader(message: InsertPlayerEvent, reader: jspb.BinaryReader): InsertPlayerEvent;
}

export namespace InsertPlayerEvent {
    export type AsObject = {
        player?: Player.AsObject,
    }
}

export class DeletePlayerEvent extends jspb.Message { 
    getId(): string;
    setId(value: string): DeletePlayerEvent;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): DeletePlayerEvent.AsObject;
    static toObject(includeInstance: boolean, msg: DeletePlayerEvent): DeletePlayerEvent.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: DeletePlayerEvent, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): DeletePlayerEvent;
    static deserializeBinaryFromReader(message: DeletePlayerEvent, reader: jspb.BinaryReader): DeletePlayerEvent;
}

export namespace DeletePlayerEvent {
    export type AsObject = {
        id: string,
    }
}

export class EventResponse extends jspb.Message { 

    hasInitializationEvent(): boolean;
    clearInitializationEvent(): void;
    getInitializationEvent(): InitializationEvent | undefined;
    setInitializationEvent(value?: InitializationEvent): EventResponse;

    hasUpsertDamageOptionEvent(): boolean;
    clearUpsertDamageOptionEvent(): void;
    getUpsertDamageOptionEvent(): UpsertDamageOptionEvent | undefined;
    setUpsertDamageOptionEvent(value?: UpsertDamageOptionEvent): EventResponse;

    hasUpsertEntryEvent(): boolean;
    clearUpsertEntryEvent(): void;
    getUpsertEntryEvent(): UpsertEntryEvent | undefined;
    setUpsertEntryEvent(value?: UpsertEntryEvent): EventResponse;

    hasDeleteEntryEvent(): boolean;
    clearDeleteEntryEvent(): void;
    getDeleteEntryEvent(): DeleteEntryEvent | undefined;
    setDeleteEntryEvent(value?: DeleteEntryEvent): EventResponse;

    hasInsertPlayerEvent(): boolean;
    clearInsertPlayerEvent(): void;
    getInsertPlayerEvent(): InsertPlayerEvent | undefined;
    setInsertPlayerEvent(value?: InsertPlayerEvent): EventResponse;

    hasDeletePlayerEvent(): boolean;
    clearDeletePlayerEvent(): void;
    getDeletePlayerEvent(): DeletePlayerEvent | undefined;
    setDeletePlayerEvent(value?: DeletePlayerEvent): EventResponse;

    getEventCase(): EventResponse.EventCase;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): EventResponse.AsObject;
    static toObject(includeInstance: boolean, msg: EventResponse): EventResponse.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: EventResponse, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): EventResponse;
    static deserializeBinaryFromReader(message: EventResponse, reader: jspb.BinaryReader): EventResponse;
}

export namespace EventResponse {
    export type AsObject = {
        initializationEvent?: InitializationEvent.AsObject,
        upsertDamageOptionEvent?: UpsertDamageOptionEvent.AsObject,
        upsertEntryEvent?: UpsertEntryEvent.AsObject,
        deleteEntryEvent?: DeleteEntryEvent.AsObject,
        insertPlayerEvent?: InsertPlayerEvent.AsObject,
        deletePlayerEvent?: DeletePlayerEvent.AsObject,
    }

    export enum EventCase {
        EVENT_NOT_SET = 0,
        INITIALIZATION_EVENT = 1,
        UPSERT_DAMAGE_OPTION_EVENT = 2,
        UPSERT_ENTRY_EVENT = 3,
        DELETE_ENTRY_EVENT = 4,
        INSERT_PLAYER_EVENT = 5,
        DELETE_PLAYER_EVENT = 6,
    }

}
