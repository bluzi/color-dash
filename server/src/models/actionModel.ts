import { Player } from './../../../src/models/player.model';

export interface Action {
    resolve(player: Player): Promise<void>;
}

export class Steal implements Action {
    async resolve(player: Player): Promise<void> {
        return;
    }
}

export class Exchange implements Action {
    async resolve(player: Player): Promise<void> {
        return;
    }
}

export class Assassinate implements Action {
    async resolve(player: Player): Promise<void> {
        return;
    }
}


export class ForeignAid implements Action {
    async resolve(player: Player): Promise<void> {
        player.coins += 2;
        return;
    }
}

export class Coup implements Action {
    async resolve(player: Player): Promise<void> {
        if (player.coins > 7) {
        }
        return;
    }
}

export class Income implements Action {
    async resolve(player: Player): Promise<void> {
        player.coins++;
        return;
    }
}
