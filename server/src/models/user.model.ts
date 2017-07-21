export class BaseUser {
    clientId: string;
    accessToken: string;
}

export class User extends BaseUser {
    pressing?: string;
    color?: string;
    alias: string;
    score: number; 
}
