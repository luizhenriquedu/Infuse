import { Middleware } from "./Middleware";

export type ControllerMetadata = {
    prefix: string;
    routes: {
        method: Method;
        path: string;
        handlerName: string;
    }[];
    middlewares: any;
};
