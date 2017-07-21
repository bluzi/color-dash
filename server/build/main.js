"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context/context");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const helpers_1 = require("./helpers");
const figlet = require("figlet");
const fs = require("fs");
const path = require("path");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.context = new context_1.ServerContext();
        this.context.rooms = [];
        this.context.users = [];
        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.context.io = socketIo(this.httpServer);
        console.log(figlet.textSync('Welcome'));
        this.api = this.getApi();
        this.listen();
    }
    getApi() {
        const api = {};
        fs.readdirSync(path.join(__dirname, 'endpoints'))
            .filter(filename => filename.includes('.api.'))
            .forEach(endpointName => {
            const apiEndpoint = require(path.join(__dirname, 'endpoints', endpointName));
            for (const eventName in apiEndpoint) {
                helpers_1.log(`Initializing event '${endpointName}.${eventName}'`);
                api[eventName] = apiEndpoint[eventName];
            }
        });
        return api;
    }
    listen() {
        this.httpServer.listen(8080, () => {
            helpers_1.log('Waiting for connections...');
        });
        this.context.io.on('connect', (socket) => {
            helpers_1.log(`Connected client on port ${socket.client.id}`);
            for (const eventName in this.api) {
                socket.on(eventName, (...args) => {
                    const currentUser = this.context.users.find(user => user.clientId === socket.client.id);
                    this.api[eventName].apply(null, [socket, this.context, currentUser, ...args]);
                });
            }
            ;
            socket.on('disconnect', () => {
                helpers_1.log('Client disconnected');
            });
        });
    }
}
exports.default = Server.bootstrap().expressApp;
