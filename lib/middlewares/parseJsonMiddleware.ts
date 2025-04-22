import { HttpContext } from "../../interfaces/HttpContext";
import { Middleware } from "../../types/Middleware";
import { Method } from "../../types/Route";
import { bodyParser } from "../parser/bodyParser";

export async function parseJsonMiddleware(ctx: HttpContext, next: () => Promise<void>) {
    if (["POST", "PUT", "PATCH"].includes(ctx.Request.method as Method)) {
        try {
            ctx.body = await bodyParser(ctx.Request);
        } catch (e) {
            console.error(e);
            ctx.Response.end("Invalid body");
            return;
        }
    }
    await next();
}
