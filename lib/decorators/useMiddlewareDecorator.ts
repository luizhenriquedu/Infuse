import { MIDDLEWARES_KEY } from "./controllerDecorator";

export function Use(middleware: Function): MethodDecorator {
    return (target, key) => {
        const middlewares = Reflect.getMetadata(MIDDLEWARES_KEY, target.constructor) || [];
        middlewares[key as string] = (middlewares[key as string] || []).concat(middleware);
        Reflect.defineMetadata(MIDDLEWARES_KEY, middlewares, target.constructor);
    };
}
