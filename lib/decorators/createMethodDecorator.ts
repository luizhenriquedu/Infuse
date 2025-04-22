import { Method } from "../../types/Route";
import "reflect-metadata";
import { ROUTES_KEY } from "./controllerDecorator";
export function createMethodDecorator(method: Method) {
    return function (path: string): MethodDecorator {
        return function (target, key) {
            const routes: {
                method: Method;
                path: string;
                handlerName: string;
            }[] = Reflect.getMetadata(ROUTES_KEY, target.constructor) || [];
            routes.push({ method, path, handlerName: key as string });
            Reflect.defineMetadata(ROUTES_KEY, routes, target.constructor);
        };
    };
}

export const HttpGet = createMethodDecorator("GET");
export const HttpDelete = createMethodDecorator("DELETE");
export const HttpPut = createMethodDecorator("PUT");
export const HttpPost = createMethodDecorator("POST");
export const HttpPatch = createMethodDecorator("PATCH");
