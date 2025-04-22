import { createServer, IncomingMessage, OutgoingMessage, Server, ServerResponse } from "http";
import { HttpContext } from "../interfaces/HttpContext";
import { Method } from "../types/Route";
import { Router } from "./Router";
import { bodyParser } from "./parser/bodyParser";
import { Middleware } from "../types/Middleware";

export class App {
    declare server: Server<typeof IncomingMessage, typeof ServerResponse>;
    private middlewares: Middleware[] = [];
    private router = new Router();

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

    private async handler(req: IncomingMessage, res: ServerResponse) {
        const method = req.method as Method;
        const url = req.url || "/";
        const result = this.router.find(method, url);

        if (!result?.handler) {
            res.statusCode = 404;
            res.end(`Not found ${url}`);
            return;
        }

        const ctx: HttpContext = {
            Request: req,
            Response: res,
            params: result.params || {},
        };

        if (["POST", "PUT", "PATCH"].includes(method)) {
            try {
                ctx.body = await bodyParser(req);
            } catch (e) {
                console.error(e);
                res.end("Invalid body");
                return;
            }
        }
        result.handler(ctx);
    }
}
