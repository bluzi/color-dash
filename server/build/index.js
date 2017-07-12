"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const context_1 = require("./context/context");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const services_1 = require("./services");
const log_1 = require("./log");
const figlet = require("figlet");
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
        this.listen();
    }
    listen() {
        this.httpServer.listen(8080, () => {
            log_1.log('Waiting for connections...');
        });
        this.context.io.on('connect', (socket) => {
            log_1.log(`Connected client on port ${socket.client.id}`);
            services_1.default.forEach(service => {
                const serviceApi = require(`./services/${service}`);
                Object.keys(serviceApi).forEach(eventName => {
                    log_1.log(`Initializing event '${eventName}'`);
                    socket.on(eventName, (...args) => {
                        const currentUser = this.context.users.find(user => user.clientId === socket.client.id);
                        serviceApi[eventName].apply(null, [socket, this.context, currentUser, ...args]);
                    });
                });
            });
            socket.on('disconnect', () => {
                log_1.log('Client disconnected');
            });
        });
    }
}
exports.default = Server.bootstrap().expressApp;
