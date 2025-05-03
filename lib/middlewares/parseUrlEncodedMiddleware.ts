import { HttpContext } from "../classes/HttpContext";
import { Method } from "../../types/Route";

import { parseUrlEncoded } from "../parser/parseUrlEncoded";

export async function parseUrlEncodedMiddleware(ctx: HttpContext, next: () => Promise<void>) {
    if (["POST", "PUT", "PATCH"].includes(ctx.request.method as Method)) {
        try {
            ctx.body = await parseUrlEncoded(ctx.request);
        } catch (e) {
            console.error(e);
            ctx.response.end("Invalid body");
            return;
        }
    }
    return await next();
}
