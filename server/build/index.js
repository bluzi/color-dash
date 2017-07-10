"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.expressApp = express();
        this.httpServer = http.createServer(this.expressApp);
        this.io = socketIo(this.httpServer);
        this.rooms = [];
        this.users = [];
        console.log(figlet.textSync('Welcome'));
        this.listen();
    }
    listen() {
        this.httpServer.listen(8080, () => {
            log_1.log('Waiting for connections...');
        });
        this.io.on('connect', (socket) => {
            log_1.log(`Connected client on port ${socket.client.id}`);
            services_1.default.forEach(service => {
                const serviceApi = require(`./services/${service}`);
                Object.keys(serviceApi).forEach(eventName => {
                    log_1.log(`Initializing event '${eventName}'`);
                    socket.on(eventName, (...args) => serviceApi[eventName].apply(this, [socket, ...args]));
                });
            });
            socket.on('disconnect', () => {
                log_1.log('Client disconnected');
            });
        });
    }
    generateId() {
        let id = '';
        do {
            const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            for (let i = 0; i < 3; i++) {
                id += possible.charAt(Math.floor(Math.random() * possible.length));
            }
        } while (this.rooms.some(room => room.roomId === id));
        return id;
    }
}
exports.default = Server.bootstrap().expressApp;
