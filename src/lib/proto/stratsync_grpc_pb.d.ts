// package: stratsync
// file: stratsync.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as stratsync_pb from "./stratsync_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

interface IStratSyncService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    event: IStratSyncService_IEvent;
    upsertDamageOption: IStratSyncService_IUpsertDamageOption;
    upsertEntry: IStratSyncService_IUpsertEntry;
    deleteEntry: IStratSyncService_IDeleteEntry;
    insertPlayer: IStratSyncService_IInsertPlayer;
    deletePlayer: IStratSyncService_IDeletePlayer;
}

interface IStratSyncService_IEvent extends grpc.MethodDefinition<stratsync_pb.SubscriptionRequest, stratsync_pb.EventResponse> {
    path: "/stratsync.StratSync/Event";
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<stratsync_pb.SubscriptionRequest>;
    requestDeserialize: grpc.deserialize<stratsync_pb.SubscriptionRequest>;
    responseSerialize: grpc.serialize<stratsync_pb.EventResponse>;
    responseDeserialize: grpc.deserialize<stratsync_pb.EventResponse>;
}
interface IStratSyncService_IUpsertDamageOption extends grpc.MethodDefinition<stratsync_pb.UpsertDamageOptionRequest, google_protobuf_empty_pb.Empty> {
    path: "/stratsync.StratSync/UpsertDamageOption";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stratsync_pb.UpsertDamageOptionRequest>;
    requestDeserialize: grpc.deserialize<stratsync_pb.UpsertDamageOptionRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IStratSyncService_IUpsertEntry extends grpc.MethodDefinition<stratsync_pb.UpsertEntryRequest, google_protobuf_empty_pb.Empty> {
    path: "/stratsync.StratSync/UpsertEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stratsync_pb.UpsertEntryRequest>;
    requestDeserialize: grpc.deserialize<stratsync_pb.UpsertEntryRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IStratSyncService_IDeleteEntry extends grpc.MethodDefinition<stratsync_pb.DeleteEntryRequest, google_protobuf_empty_pb.Empty> {
    path: "/stratsync.StratSync/DeleteEntry";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stratsync_pb.DeleteEntryRequest>;
    requestDeserialize: grpc.deserialize<stratsync_pb.DeleteEntryRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IStratSyncService_IInsertPlayer extends grpc.MethodDefinition<stratsync_pb.InsertPlayerRequest, google_protobuf_empty_pb.Empty> {
    path: "/stratsync.StratSync/InsertPlayer";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stratsync_pb.InsertPlayerRequest>;
    requestDeserialize: grpc.deserialize<stratsync_pb.InsertPlayerRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}
interface IStratSyncService_IDeletePlayer extends grpc.MethodDefinition<stratsync_pb.DeletePlayerRequest, google_protobuf_empty_pb.Empty> {
    path: "/stratsync.StratSync/DeletePlayer";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<stratsync_pb.DeletePlayerRequest>;
    requestDeserialize: grpc.deserialize<stratsync_pb.DeletePlayerRequest>;
    responseSerialize: grpc.serialize<google_protobuf_empty_pb.Empty>;
    responseDeserialize: grpc.deserialize<google_protobuf_empty_pb.Empty>;
}

export const StratSyncService: IStratSyncService;

export interface IStratSyncServer {
    event: grpc.handleServerStreamingCall<stratsync_pb.SubscriptionRequest, stratsync_pb.EventResponse>;
    upsertDamageOption: grpc.handleUnaryCall<stratsync_pb.UpsertDamageOptionRequest, google_protobuf_empty_pb.Empty>;
    upsertEntry: grpc.handleUnaryCall<stratsync_pb.UpsertEntryRequest, google_protobuf_empty_pb.Empty>;
    deleteEntry: grpc.handleUnaryCall<stratsync_pb.DeleteEntryRequest, google_protobuf_empty_pb.Empty>;
    insertPlayer: grpc.handleUnaryCall<stratsync_pb.InsertPlayerRequest, google_protobuf_empty_pb.Empty>;
    deletePlayer: grpc.handleUnaryCall<stratsync_pb.DeletePlayerRequest, google_protobuf_empty_pb.Empty>;
}

export interface IStratSyncClient {
    event(request: stratsync_pb.SubscriptionRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stratsync_pb.EventResponse>;
    event(request: stratsync_pb.SubscriptionRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stratsync_pb.EventResponse>;
    upsertDamageOption(request: stratsync_pb.UpsertDamageOptionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    upsertDamageOption(request: stratsync_pb.UpsertDamageOptionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    upsertDamageOption(request: stratsync_pb.UpsertDamageOptionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    upsertEntry(request: stratsync_pb.UpsertEntryRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    upsertEntry(request: stratsync_pb.UpsertEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    upsertEntry(request: stratsync_pb.UpsertEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteEntry(request: stratsync_pb.DeleteEntryRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteEntry(request: stratsync_pb.DeleteEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deleteEntry(request: stratsync_pb.DeleteEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    insertPlayer(request: stratsync_pb.InsertPlayerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    insertPlayer(request: stratsync_pb.InsertPlayerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    insertPlayer(request: stratsync_pb.InsertPlayerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deletePlayer(request: stratsync_pb.DeletePlayerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deletePlayer(request: stratsync_pb.DeletePlayerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    deletePlayer(request: stratsync_pb.DeletePlayerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}

export class StratSyncClient extends grpc.Client implements IStratSyncClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public event(request: stratsync_pb.SubscriptionRequest, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stratsync_pb.EventResponse>;
    public event(request: stratsync_pb.SubscriptionRequest, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<stratsync_pb.EventResponse>;
    public upsertDamageOption(request: stratsync_pb.UpsertDamageOptionRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public upsertDamageOption(request: stratsync_pb.UpsertDamageOptionRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public upsertDamageOption(request: stratsync_pb.UpsertDamageOptionRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public upsertEntry(request: stratsync_pb.UpsertEntryRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public upsertEntry(request: stratsync_pb.UpsertEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public upsertEntry(request: stratsync_pb.UpsertEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteEntry(request: stratsync_pb.DeleteEntryRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteEntry(request: stratsync_pb.DeleteEntryRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deleteEntry(request: stratsync_pb.DeleteEntryRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public insertPlayer(request: stratsync_pb.InsertPlayerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public insertPlayer(request: stratsync_pb.InsertPlayerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public insertPlayer(request: stratsync_pb.InsertPlayerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deletePlayer(request: stratsync_pb.DeletePlayerRequest, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deletePlayer(request: stratsync_pb.DeletePlayerRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
    public deletePlayer(request: stratsync_pb.DeletePlayerRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: google_protobuf_empty_pb.Empty) => void): grpc.ClientUnaryCall;
}
