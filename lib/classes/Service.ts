import { Constructor } from "../../types/Constructor";

export class Service{

    constructor(public scope: string, public object: Object){}

    static createService<T extends Constructor<Object> | Object>(scope: string, constructor: T){
        if(typeof constructor == typeof Object)
            return new Service(scope, constructor)
        return new Service(scope, new (constructor as Constructor<Object>)())
    }
}