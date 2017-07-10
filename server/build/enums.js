"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UserState;
(function (UserState) {
    UserState[UserState["Disconnected"] = 0] = "Disconnected";
    UserState[UserState["Connected"] = 1] = "Connected";
})(UserState = exports.UserState || (exports.UserState = {}));
var RoomState;
(function (RoomState) {
    RoomState[RoomState["WaitingForPlayers"] = 0] = "WaitingForPlayers";
    RoomState[RoomState["GameStarted"] = 1] = "GameStarted";
})(RoomState = exports.RoomState || (exports.RoomState = {}));
