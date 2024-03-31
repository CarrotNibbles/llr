// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var stratsync_pb = require('./stratsync_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_DeleteEntryRequest(arg) {
  if (!(arg instanceof stratsync_pb.DeleteEntryRequest)) {
    throw new Error('Expected argument of type stratsync.DeleteEntryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_DeleteEntryRequest(buffer_arg) {
  return stratsync_pb.DeleteEntryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_DeletePlayerRequest(arg) {
  if (!(arg instanceof stratsync_pb.DeletePlayerRequest)) {
    throw new Error('Expected argument of type stratsync.DeletePlayerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_DeletePlayerRequest(buffer_arg) {
  return stratsync_pb.DeletePlayerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_EventResponse(arg) {
  if (!(arg instanceof stratsync_pb.EventResponse)) {
    throw new Error('Expected argument of type stratsync.EventResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_EventResponse(buffer_arg) {
  return stratsync_pb.EventResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_InsertPlayerRequest(arg) {
  if (!(arg instanceof stratsync_pb.InsertPlayerRequest)) {
    throw new Error('Expected argument of type stratsync.InsertPlayerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_InsertPlayerRequest(buffer_arg) {
  return stratsync_pb.InsertPlayerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_SubscriptionRequest(arg) {
  if (!(arg instanceof stratsync_pb.SubscriptionRequest)) {
    throw new Error('Expected argument of type stratsync.SubscriptionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_SubscriptionRequest(buffer_arg) {
  return stratsync_pb.SubscriptionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_UpsertDamageOptionRequest(arg) {
  if (!(arg instanceof stratsync_pb.UpsertDamageOptionRequest)) {
    throw new Error('Expected argument of type stratsync.UpsertDamageOptionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_UpsertDamageOptionRequest(buffer_arg) {
  return stratsync_pb.UpsertDamageOptionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_stratsync_UpsertEntryRequest(arg) {
  if (!(arg instanceof stratsync_pb.UpsertEntryRequest)) {
    throw new Error('Expected argument of type stratsync.UpsertEntryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_stratsync_UpsertEntryRequest(buffer_arg) {
  return stratsync_pb.UpsertEntryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


var StratSyncService = exports.StratSyncService = {
  event: {
    path: '/stratsync.StratSync/Event',
    requestStream: false,
    responseStream: true,
    requestType: stratsync_pb.SubscriptionRequest,
    responseType: stratsync_pb.EventResponse,
    requestSerialize: serialize_stratsync_SubscriptionRequest,
    requestDeserialize: deserialize_stratsync_SubscriptionRequest,
    responseSerialize: serialize_stratsync_EventResponse,
    responseDeserialize: deserialize_stratsync_EventResponse,
  },
  upsertDamageOption: {
    path: '/stratsync.StratSync/UpsertDamageOption',
    requestStream: false,
    responseStream: false,
    requestType: stratsync_pb.UpsertDamageOptionRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_stratsync_UpsertDamageOptionRequest,
    requestDeserialize: deserialize_stratsync_UpsertDamageOptionRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  upsertEntry: {
    path: '/stratsync.StratSync/UpsertEntry',
    requestStream: false,
    responseStream: false,
    requestType: stratsync_pb.UpsertEntryRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_stratsync_UpsertEntryRequest,
    requestDeserialize: deserialize_stratsync_UpsertEntryRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  deleteEntry: {
    path: '/stratsync.StratSync/DeleteEntry',
    requestStream: false,
    responseStream: false,
    requestType: stratsync_pb.DeleteEntryRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_stratsync_DeleteEntryRequest,
    requestDeserialize: deserialize_stratsync_DeleteEntryRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  insertPlayer: {
    path: '/stratsync.StratSync/InsertPlayer',
    requestStream: false,
    responseStream: false,
    requestType: stratsync_pb.InsertPlayerRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_stratsync_InsertPlayerRequest,
    requestDeserialize: deserialize_stratsync_InsertPlayerRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
  deletePlayer: {
    path: '/stratsync.StratSync/DeletePlayer',
    requestStream: false,
    responseStream: false,
    requestType: stratsync_pb.DeletePlayerRequest,
    responseType: google_protobuf_empty_pb.Empty,
    requestSerialize: serialize_stratsync_DeletePlayerRequest,
    requestDeserialize: deserialize_stratsync_DeletePlayerRequest,
    responseSerialize: serialize_google_protobuf_Empty,
    responseDeserialize: deserialize_google_protobuf_Empty,
  },
};

exports.StratSyncClient = grpc.makeGenericClientConstructor(StratSyncService);
