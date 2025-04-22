import { Middleware } from "./Middleware";

export type controllerMetadata = {
    prefix: string;
    routes: {
        method: Method;
        path: string;
        handlerName: string;
    }[];
    middlewares: Function[];
};
