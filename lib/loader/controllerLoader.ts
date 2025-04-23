import { glob } from "glob";
import { BaseController } from "../classes/BaseController";
import { App } from "../App";
import { Constructor } from "../../types/Constructor";
import { getControllerMetadata } from "../decorators/controllerDecorator";
import { Middleware } from "../../types/Middleware";
import { getControllerBodyMetadata } from "../decorators/FromBodyDecorator";
import { parseJsonToInstance } from "../parser/parseJsonToInstance";
import { HttpContext } from "../../interfaces/HttpContext";
export async function importControllers() {
    const files = (await glob(`${process.cwd()}/src/controllers/**/*`, { absolute: true })) || [];
    for (const file of files) {
        if (file.endsWith(".ts") || file.endsWith(".js")) {
            require(file);
        }
    }
}

export function useController<T extends Constructor<BaseController>>(cls: T, app: App) {
    const instance = new cls();

    const { prefix, routes, middlewares } = getControllerMetadata(cls);
    for (const { method, path, handlerName } of routes) {
        const handler = (instance[handlerName as keyof typeof instance] as Function) || undefined;
        const routeMiddlewares: Middleware[] = middlewares[handlerName] || [];
        const result = getControllerBodyMetadata(cls, handlerName);
        app.add(method, prefix + path, async (ctx) => {
            let i = 0;
            const exec = async () => {
                for (i = 0; i < routeMiddlewares.length; i++) {
                    await routeMiddlewares[i](ctx, () => Promise.resolve());
                }

                let args: Object[] = Array(result.paramtypes.length).fill(undefined);
                for (let j = 0; j < result.paramtypes.length; j++) {
                    const type = result.paramtypes[j];
                    const meta = result.metadata.find((p) => p.index === j);
                    if (type === HttpContext) {
                        args[j] = ctx;
                    } else if (meta) args[j] = parseJsonToInstance(type, ctx.body, result.metadata[j]);
                }
                await handler(...args);
            };

            await exec();
        });
    }
}
