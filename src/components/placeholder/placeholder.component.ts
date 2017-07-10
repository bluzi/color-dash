import { Component, ViewChild, ViewContainerRef, AfterViewInit, ComponentFactoryResolver, Input, Type, ComponentRef } from '@angular/core';
import { NavigationRequest } from '../../services/navigation.service';

@Component({
    selector: 'app-placeholder',
    template: '<ng-template #placeholder></ng-template>'
})
export class PlaceholderComponent {
    @ViewChild('placeholder', { read: ViewContainerRef }) placeholder;

    @Input() set component(value: NavigationRequest) {
        this.placeholder.clear();

        console.log('NavigationRequest', value);

        if (value && value.page) {
            const factory = this.componentResolver.resolveComponentFactory(<Type<any>>value.page);
            const component = this.placeholder.createComponent(factory).instance;

            if (value.args) {
                Object.keys(value.args).forEach(argKey => component[argKey] = value.args[argKey]);
            }
        }
    }

    constructor(private componentResolver: ComponentFactoryResolver) { }
}
