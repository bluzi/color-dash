"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerContextBase {
}
exports.ServerContextBase = ServerContextBase;
class ServerContext extends ServerContextBase {
    constructor() {
        super(...arguments);
        this.rooms = [];
    }
}
exports.ServerContext = ServerContext;
