import { Player } from './player.model';

export interface CardMetadata {
    actionName?: string;
    counterActions?: string[];
}

export function CardDecorator(metadata: CardMetadata) {
    return (target: Object) => {
        // implement class decorator here, the class decorator
        // will have access to the decorator arguments (filter)
        // because they are  stored in a closure
    }
}

export interface Card {
    action(player: Player): void;
}

@CardDecorator({
    actionName: 'exchange',
    counterActions: ['stealing']
})
export class AmbassadorCard implements Card {
    action(player: Player): void {
    }
}

@CardDecorator({
    actionName: 'stealing',
    counterActions: ['stealing']
})
export class CaptainCard implements Card {
    action(player: Player): void {
    }
}

@CardDecorator({
    counterActions: ['assassination']
})
export class ContessaCard implements Card {
    action(player: Player): void {
    }
}

@CardDecorator({
    actionName: 'assassination'
})
export class AssassinCard implements Card {
    action(player: Player): void {
    }
}

@CardDecorator({
    actionName: 'foreign-aid',
    counterActions: ['foreign-aid']
})
export class DukeCard implements Card {
    action(player: Player): void {
    }
}
