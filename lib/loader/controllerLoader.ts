import { glob } from "glob";
import { BaseController } from "../classes/BaseController";
import { App } from "../App";
import { Constructor } from "../../types/Constructor";
import { getControllerMetadata } from "../decorators/controllerDecorator";
import { Middleware } from "../../types/Middleware";

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
        const routeMiddlewares: Function[] = middlewares.filter((x) => x.name == handlerName);

        app.add(method, prefix + path, async (ctx) => {
            const exec = async () => {
                let i = 0;
                if (i < routeMiddlewares.length) {
                    await routeMiddlewares[i++](ctx, exec);
                } else {
                    await handler(ctx);
                }
            };

            await exec();
        });
    }
}
