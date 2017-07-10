// import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from "@angular/router";
// import { Injectable } from "@angular/core";
// import { Observable } from "rxjs/Observable";
// import { SocketService } from "services/socket.service";

// @Injectable()
// export class SocketResolver implements Resolve<void> {
//     constructor(private socketService: SocketService) { }

//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): void | Observable<void> | Promise<void> {
//         return this.socketService.get().then(socket => console.log("Connection established"));
//     }

// }