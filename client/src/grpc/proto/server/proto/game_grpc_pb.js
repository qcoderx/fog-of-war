// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var server_proto_game_pb = require('../../server/proto/game_pb.js');

function serialize_game_AttackRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.AttackRequest)) {
    throw new Error('Expected argument of type game.AttackRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_AttackRequest(buffer_arg) {
  return server_proto_game_pb.AttackRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_AttackResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.AttackResponse)) {
    throw new Error('Expected argument of type game.AttackResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_AttackResponse(buffer_arg) {
  return server_proto_game_pb.AttackResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_CollectLootRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.CollectLootRequest)) {
    throw new Error('Expected argument of type game.CollectLootRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_CollectLootRequest(buffer_arg) {
  return server_proto_game_pb.CollectLootRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_CollectLootResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.CollectLootResponse)) {
    throw new Error('Expected argument of type game.CollectLootResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_CollectLootResponse(buffer_arg) {
  return server_proto_game_pb.CollectLootResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_ConfirmDepositRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.ConfirmDepositRequest)) {
    throw new Error('Expected argument of type game.ConfirmDepositRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_ConfirmDepositRequest(buffer_arg) {
  return server_proto_game_pb.ConfirmDepositRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_ConfirmDepositResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.ConfirmDepositResponse)) {
    throw new Error('Expected argument of type game.ConfirmDepositResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_ConfirmDepositResponse(buffer_arg) {
  return server_proto_game_pb.ConfirmDepositResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_ConnectRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.ConnectRequest)) {
    throw new Error('Expected argument of type game.ConnectRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_ConnectRequest(buffer_arg) {
  return server_proto_game_pb.ConnectRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_CreateSessionRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.CreateSessionRequest)) {
    throw new Error('Expected argument of type game.CreateSessionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_CreateSessionRequest(buffer_arg) {
  return server_proto_game_pb.CreateSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_CreateSessionResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.CreateSessionResponse)) {
    throw new Error('Expected argument of type game.CreateSessionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_CreateSessionResponse(buffer_arg) {
  return server_proto_game_pb.CreateSessionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_GameStateUpdate(arg) {
  if (!(arg instanceof server_proto_game_pb.GameStateUpdate)) {
    throw new Error('Expected argument of type game.GameStateUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_GameStateUpdate(buffer_arg) {
  return server_proto_game_pb.GameStateUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_GetHouseWalletRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.GetHouseWalletRequest)) {
    throw new Error('Expected argument of type game.GetHouseWalletRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_GetHouseWalletRequest(buffer_arg) {
  return server_proto_game_pb.GetHouseWalletRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_GetHouseWalletResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.GetHouseWalletResponse)) {
    throw new Error('Expected argument of type game.GetHouseWalletResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_GetHouseWalletResponse(buffer_arg) {
  return server_proto_game_pb.GetHouseWalletResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_JoinSessionRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.JoinSessionRequest)) {
    throw new Error('Expected argument of type game.JoinSessionRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_JoinSessionRequest(buffer_arg) {
  return server_proto_game_pb.JoinSessionRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_JoinSessionResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.JoinSessionResponse)) {
    throw new Error('Expected argument of type game.JoinSessionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_JoinSessionResponse(buffer_arg) {
  return server_proto_game_pb.JoinSessionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_ListSessionsRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.ListSessionsRequest)) {
    throw new Error('Expected argument of type game.ListSessionsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_ListSessionsRequest(buffer_arg) {
  return server_proto_game_pb.ListSessionsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_ListSessionsResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.ListSessionsResponse)) {
    throw new Error('Expected argument of type game.ListSessionsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_ListSessionsResponse(buffer_arg) {
  return server_proto_game_pb.ListSessionsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_LobbyUpdate(arg) {
  if (!(arg instanceof server_proto_game_pb.LobbyUpdate)) {
    throw new Error('Expected argument of type game.LobbyUpdate');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_LobbyUpdate(buffer_arg) {
  return server_proto_game_pb.LobbyUpdate.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_LoginRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.LoginRequest)) {
    throw new Error('Expected argument of type game.LoginRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_LoginRequest(buffer_arg) {
  return server_proto_game_pb.LoginRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_LoginResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.LoginResponse)) {
    throw new Error('Expected argument of type game.LoginResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_LoginResponse(buffer_arg) {
  return server_proto_game_pb.LoginResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_MoveRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.MoveRequest)) {
    throw new Error('Expected argument of type game.MoveRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_MoveRequest(buffer_arg) {
  return server_proto_game_pb.MoveRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_MoveResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.MoveResponse)) {
    throw new Error('Expected argument of type game.MoveResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_MoveResponse(buffer_arg) {
  return server_proto_game_pb.MoveResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_StartGameRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.StartGameRequest)) {
    throw new Error('Expected argument of type game.StartGameRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_StartGameRequest(buffer_arg) {
  return server_proto_game_pb.StartGameRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_StartGameResponse(arg) {
  if (!(arg instanceof server_proto_game_pb.StartGameResponse)) {
    throw new Error('Expected argument of type game.StartGameResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_StartGameResponse(buffer_arg) {
  return server_proto_game_pb.StartGameResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_game_WatchLobbyRequest(arg) {
  if (!(arg instanceof server_proto_game_pb.WatchLobbyRequest)) {
    throw new Error('Expected argument of type game.WatchLobbyRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_game_WatchLobbyRequest(buffer_arg) {
  return server_proto_game_pb.WatchLobbyRequest.deserializeBinary(new Uint8Array(buffer_arg));
}


// Authentication Service
var AuthServiceService = exports.AuthServiceService = {
  login: {
    path: '/game.AuthService/Login',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.LoginRequest,
    responseType: server_proto_game_pb.LoginResponse,
    requestSerialize: serialize_game_LoginRequest,
    requestDeserialize: deserialize_game_LoginRequest,
    responseSerialize: serialize_game_LoginResponse,
    responseDeserialize: deserialize_game_LoginResponse,
  },
};

exports.AuthServiceClient = grpc.makeGenericClientConstructor(AuthServiceService, 'AuthService');
// Game Service
var GameServiceService = exports.GameServiceService = {
  // Session lifecycle
createSession: {
    path: '/game.GameService/CreateSession',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.CreateSessionRequest,
    responseType: server_proto_game_pb.CreateSessionResponse,
    requestSerialize: serialize_game_CreateSessionRequest,
    requestDeserialize: deserialize_game_CreateSessionRequest,
    responseSerialize: serialize_game_CreateSessionResponse,
    responseDeserialize: deserialize_game_CreateSessionResponse,
  },
  listSessions: {
    path: '/game.GameService/ListSessions',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.ListSessionsRequest,
    responseType: server_proto_game_pb.ListSessionsResponse,
    requestSerialize: serialize_game_ListSessionsRequest,
    requestDeserialize: deserialize_game_ListSessionsRequest,
    responseSerialize: serialize_game_ListSessionsResponse,
    responseDeserialize: deserialize_game_ListSessionsResponse,
  },
  joinSession: {
    path: '/game.GameService/JoinSession',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.JoinSessionRequest,
    responseType: server_proto_game_pb.JoinSessionResponse,
    requestSerialize: serialize_game_JoinSessionRequest,
    requestDeserialize: deserialize_game_JoinSessionRequest,
    responseSerialize: serialize_game_JoinSessionResponse,
    responseDeserialize: deserialize_game_JoinSessionResponse,
  },
  startGame: {
    path: '/game.GameService/StartGame',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.StartGameRequest,
    responseType: server_proto_game_pb.StartGameResponse,
    requestSerialize: serialize_game_StartGameRequest,
    requestDeserialize: deserialize_game_StartGameRequest,
    responseSerialize: serialize_game_StartGameResponse,
    responseDeserialize: deserialize_game_StartGameResponse,
  },
  watchLobby: {
    path: '/game.GameService/WatchLobby',
    requestStream: false,
    responseStream: true,
    requestType: server_proto_game_pb.WatchLobbyRequest,
    responseType: server_proto_game_pb.LobbyUpdate,
    requestSerialize: serialize_game_WatchLobbyRequest,
    requestDeserialize: deserialize_game_WatchLobbyRequest,
    responseSerialize: serialize_game_LobbyUpdate,
    responseDeserialize: deserialize_game_LobbyUpdate,
  },
  // Escrow / payments
getHouseWallet: {
    path: '/game.GameService/GetHouseWallet',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.GetHouseWalletRequest,
    responseType: server_proto_game_pb.GetHouseWalletResponse,
    requestSerialize: serialize_game_GetHouseWalletRequest,
    requestDeserialize: deserialize_game_GetHouseWalletRequest,
    responseSerialize: serialize_game_GetHouseWalletResponse,
    responseDeserialize: deserialize_game_GetHouseWalletResponse,
  },
  confirmDeposit: {
    path: '/game.GameService/ConfirmDeposit',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.ConfirmDepositRequest,
    responseType: server_proto_game_pb.ConfirmDepositResponse,
    requestSerialize: serialize_game_ConfirmDepositRequest,
    requestDeserialize: deserialize_game_ConfirmDepositRequest,
    responseSerialize: serialize_game_ConfirmDepositResponse,
    responseDeserialize: deserialize_game_ConfirmDepositResponse,
  },
  // In-game
connect: {
    path: '/game.GameService/Connect',
    requestStream: false,
    responseStream: true,
    requestType: server_proto_game_pb.ConnectRequest,
    responseType: server_proto_game_pb.GameStateUpdate,
    requestSerialize: serialize_game_ConnectRequest,
    requestDeserialize: deserialize_game_ConnectRequest,
    responseSerialize: serialize_game_GameStateUpdate,
    responseDeserialize: deserialize_game_GameStateUpdate,
  },
  move: {
    path: '/game.GameService/Move',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.MoveRequest,
    responseType: server_proto_game_pb.MoveResponse,
    requestSerialize: serialize_game_MoveRequest,
    requestDeserialize: deserialize_game_MoveRequest,
    responseSerialize: serialize_game_MoveResponse,
    responseDeserialize: deserialize_game_MoveResponse,
  },
  collectLoot: {
    path: '/game.GameService/CollectLoot',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.CollectLootRequest,
    responseType: server_proto_game_pb.CollectLootResponse,
    requestSerialize: serialize_game_CollectLootRequest,
    requestDeserialize: deserialize_game_CollectLootRequest,
    responseSerialize: serialize_game_CollectLootResponse,
    responseDeserialize: deserialize_game_CollectLootResponse,
  },
  attack: {
    path: '/game.GameService/Attack',
    requestStream: false,
    responseStream: false,
    requestType: server_proto_game_pb.AttackRequest,
    responseType: server_proto_game_pb.AttackResponse,
    requestSerialize: serialize_game_AttackRequest,
    requestDeserialize: deserialize_game_AttackRequest,
    responseSerialize: serialize_game_AttackResponse,
    responseDeserialize: deserialize_game_AttackResponse,
  },
};

exports.GameServiceClient = grpc.makeGenericClientConstructor(GameServiceService, 'GameService');
