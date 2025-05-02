import { HttpContext } from "../interfaces/HttpContext";
import { Middleware } from "../types/Middleware";
import { App } from "./App";
import { Services } from "./Services";

export class Infusy {
    private _app: App = new App();
    public services: Services = new Services();
    public use(middleware: Middleware) {
        this._app.use(middleware);
    }
    public addConfigLoader<T extends Object>(typeClass: new () => T) {
        return this._app.addConfigLoader(typeClass);
    }
    public parseUrlEnconded() {
        this._app.parseUrlEncoded();
    }
    public parseJson() {
        this._app.parseJson();
    }
    public listen(port: number, callback: (err?: Error) => void) {
        this._app.listen(port, callback);
    }

    public useErrorHandler(middleware: (ctx: HttpContext, err: Error) => Promise<void>) {
        this._app.setDefaultErrorHandler(middleware);
    }

    public loadControllers() {
        this._app.loadControllers();
    }
}
