import "reflect-metadata";
import { Constructor } from "../../types/Constructor";
import { addController } from "../loader/controllerContainer";
import { BaseController } from "../classes/BaseController";
import { ControllerMetadata } from "../../types/ControllerMetadata";

export const ROUTES_KEY = Symbol("routes");
export const MIDDLEWARES_KEY = Symbol("middlewares");

export function Controller<T extends Constructor<BaseController>>(prefix: string) {
    return (target: T) => {
        Reflect.defineMetadata("prefix", prefix, target);
        addController(target);
    };
}

export function getControllerMetadata<T>(controller: Constructor<T>) {
    const metadata: ControllerMetadata = {
        prefix: Reflect.getMetadata("prefix", controller) || [],
        routes: Reflect.getMetadata(ROUTES_KEY, controller) || [],
        middlewares: Reflect.getMetadata(MIDDLEWARES_KEY, controller) || {},
    };
    return metadata;
}
