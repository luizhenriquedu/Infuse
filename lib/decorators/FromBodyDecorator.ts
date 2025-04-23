import "reflect-metadata";
import { Constructor } from "../../types/Constructor";
import { BaseController } from "../classes/BaseController";
import { FromBodyParam } from "../../types/ControllerBodyMetadata";

export const ROUTES_KEY = Symbol("routes");
export const MIDDLEWARES_KEY = Symbol("middlewares");

export function FromBody(key?: string): ParameterDecorator {
    return function (target, propertieKey, parameterIndex) {
        const existingParams: FromBodyParam[] =
            Reflect.getMetadata("body", target.constructor, propertieKey as string | symbol) || [];

        existingParams.push({
            index: parameterIndex,
            key,
        } as FromBodyParam);
        Reflect.defineMetadata("body", existingParams, target.constructor, propertieKey as string | symbol);
    };
}
export function getControllerBodyMetadata<T extends BaseController>(controller: Constructor<T>, handlerName: string) {
    const metadata: FromBodyParam[] = Reflect.getMetadata("body", controller, handlerName);
    const paramtypes: Constructor<any>[] = Reflect.getMetadata("design:paramtypes", controller.prototype, handlerName);
    return {
        metadata,
        paramtypes,
    };
}
