import { Constructor } from "../types/Constructor";
import { Service } from "./classes/Service";

export class Services {
    private _servicesContainer: Map<string, Service> = new Map<string, Service>();
    public addSingleton<T extends Object>(constructor: Constructor<T>) {
        if (this._servicesContainer.get(constructor.name)) return;
        const service = new Service("singleton", new constructor());
        this._servicesContainer.set(constructor.name, service);
    }
    public getService<T extends Object>(constructor: Constructor<T>) {
        this._servicesContainer.get(constructor.name);
    }
}
