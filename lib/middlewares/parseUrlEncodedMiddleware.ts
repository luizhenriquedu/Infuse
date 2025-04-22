import { HttpContext } from "../../interfaces/HttpContext";
import { Method } from "../../types/Route";

import { parseUrlEncoded } from "../parser/parseUrlEncoded";

export async function parseUrlEncodedMiddleware(ctx: HttpContext, next: () => Promise<void>) {
    if (["POST", "PUT", "PATCH"].includes(ctx.Request.method as Method)) {
        try {
            ctx.body = await parseUrlEncoded(ctx.Request);
        } catch (e) {
            console.error(e);
            ctx.Response.end("Invalid body");
            return;
        }
    }
    await next();
}
