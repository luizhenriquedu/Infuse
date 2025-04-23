import { HttpContext } from "../../interfaces/HttpContext";
import { Method } from "../../types/Route";
import { parseJsonBody } from "../parser/parseJsonBody";

export async function parseJsonMiddleware(ctx: HttpContext, next: () => Promise<void>) {
    if (["POST", "PUT", "PATCH"].includes(ctx.request.method as Method)) {
        try {
            ctx.body = await parseJsonBody(ctx.request);
        } catch (e) {
            console.error(e);
            ctx.response.end("Invalid body");
            return;
        }
    }
    return await next();
}
