export function log(message: string, ...params: any[]) {
    console.log(`[\x1b[36m${new Date().toLocaleTimeString()}\x1b[0m]: ${message}`, ...params);
}
