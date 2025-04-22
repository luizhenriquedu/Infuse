import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { HttpContext } from "../interfaces/HttpContext";
import { Method } from "../types/Route";
import { Router } from "./Router";
import { Middleware } from "../types/Middleware";
import { loadStack } from "./middlewares/loadStack";
import { parseJsonMiddleware } from "./middlewares/parseJsonMiddleware";
import { getControllers } from "./di/controllerContainer";
import { importControllers, useController } from "./loader/controllerLoader";
import { ConfigLoader } from "./loader/ConfigLoader";
import { parseUrlEncodedMiddleware } from "./middlewares/parseUrlEncodedMiddleware";

export class App {
    declare server: Server<typeof IncomingMessage, typeof ServerResponse>;
    private defaultErrorMiddleware: ((ctx: HttpContext, error: Error) => Promise<void>) | undefined = undefined;
    private middlewares: Middleware[] = [];
    private router = new Router();

    loadControllers() {
        importControllers().then(() => {
            const controllers = getControllers();
            for (const controller of controllers) {
                useController(controller, this);
            }
        });
    }

    public addConfigLoader<T extends Object>(typeClass: new () => T) {
        return new ConfigLoader(typeClass);
    }

    add(method: Method, path: string, handler: (ctx: HttpContext) => void) {
        this.router.add(method, path, handler);
    }

    use(middleware: Middleware) {
        this.middlewares.push(middleware);
    }

    listen(port: number, callback: (err?: Error) => void) {
        this.server = createServer(async (req, res) => await this.handler(req, res));
        this.server.listen(port, callback);
    }

    parseUrlEncoded() {
        this.use(parseUrlEncodedMiddleware);
    }

    parseJson() {
        this.use(parseJsonMiddleware);
    }

    setDefaultErrorHandler(func: (ctx: HttpContext, error: Error) => Promise<void>) {
        this.defaultErrorMiddleware = func;
    }

    private async handler(req: IncomingMessage, res: ServerResponse) {
        const method = req.method as Method;
        const url = req.url || "/";
        const result = this.router.find(method, url);

        const ctx: HttpContext = {
            Request: req,
            Response: res,
            params: result?.params || {},
        };

        const handler = result?.handler
            ? async () => result.handler(ctx)
            : async () => {
                  res.statusCode = 404;
                  res.end("Not found");
              };
        await loadStack(ctx, this.middlewares, handler, this.defaultErrorMiddleware);
    }
}
