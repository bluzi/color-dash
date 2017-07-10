import { Injectable, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

@Injectable()
export class NavigationService {
    private currentPage: Observable<NavigationRequest>;
    private pageSubscriber: Subscriber<NavigationRequest>;

    constructor() {
        this.currentPage = new Observable<NavigationRequest>(subscriber => this.pageSubscriber = subscriber);
    }

    getCurrentPage(): Observable<NavigationRequest> {
        return this.currentPage;
    }

    navigateTo(page: Component, args?: any) {
        this.pageSubscriber.next({
            page,
            args
        });
    }
}

export interface NavigationRequest {
    page: Component,
    args: any
}
