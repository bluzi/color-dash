"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Steal {
    async resolve(player) {
        return;
    }
}
exports.Steal = Steal;
class Exchange {
    async resolve(player) {
        return;
    }
}
exports.Exchange = Exchange;
class Assassinate {
    async resolve(player) {
        return;
    }
}
exports.Assassinate = Assassinate;
class ForeignAid {
    async resolve(player) {
        player.coins += 2;
        return;
    }
}
exports.ForeignAid = ForeignAid;
class Coup {
    async resolve(player) {
        if (player.coins > 7) {
        }
        return;
    }
}
exports.Coup = Coup;
class Income {
    async resolve(player) {
        player.coins++;
        return;
    }
}
exports.Income = Income;
