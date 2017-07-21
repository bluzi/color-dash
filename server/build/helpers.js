"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function log(message, ...params) {
    console.log(`[\x1b[36m${new Date().toLocaleTimeString()}\x1b[0m]: ${message}`, ...params);
}
exports.log = log;
