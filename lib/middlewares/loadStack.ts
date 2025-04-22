import { HttpContext } from "../../interfaces/HttpContext";
import { Middleware } from "../../types/Middleware";

export async function loadStack(ctx: HttpContext, middlewares: Middleware[], handler: () => Promise<void>) {
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
        ctx.Response.statusCode = 500;
        ctx.Response.end("Internal server error");
        console.error(e);
    }
}
