import { IService } from "../interfaces/IService"
import { Constructor } from "../types/Constructor"
import { Service } from "./classes/Service"

export class Services{
    private _servicesContainer: Map<string, Service> = new Map<string, Service>()
    public addSingleton<T extends Object>(constructor: Constructor<T>){
        if(this._servicesContainer.get(constructor.name)) return
        const teste = new Service("singleton", new constructor())
        console.log(teste)
        this._servicesContainer.set(constructor.name, teste)
    }
        public getService<T extends Object>(constructor: Constructor<T>){
            this._servicesContainer.get(constructor.name)
        }
}