import { HttpContext } from "../../interfaces/HttpContext";
import { MIDDLEWARES_KEY } from "./controllerDecorator";

export function Use(middleware: (ctx: HttpContext, exec: () => Promise<void>) => Promise<void>): MethodDecorator {
    return (target, key) => {
        const middlewares = Reflect.getMetadata(MIDDLEWARES_KEY, target.constructor) || [];
        middlewares[key as string] = (middlewares[key as string] || []).concat(middleware);
        Reflect.defineMetadata(MIDDLEWARES_KEY, middlewares, target.constructor);
    };
}
