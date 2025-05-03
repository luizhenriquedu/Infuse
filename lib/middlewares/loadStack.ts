import { HttpContext } from "../classes/HttpContext";
import { Middleware } from "../../types/Middleware";

export async function loadStack(
    ctx: HttpContext,
    middlewares: Middleware[],
    handler: () => Promise<void>,
    errHandler?: (ctx: HttpContext, err: Error) => Promise<void>
) {
    const stack = [...middlewares, handler];
    let index = -1;

    async function next(): Promise<void> {
        index++;
        if (index < stack.length) {
            await stack[index](ctx, next);
        }
    }

    try {
        await next();
    } catch (e) {
        if (errHandler) return await errHandler(ctx, e as Error);
        ctx.response.statusCode = 500;
        ctx.response.end("Internal server error");
        console.error(e);
    }
}
