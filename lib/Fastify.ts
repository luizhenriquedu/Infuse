import { HttpContext } from "../interfaces/HttpContext";
import { Middleware } from "../types/Middleware";
import { App } from "./App";

export class Infuse {
    private _app: App = new App();

    public use(middleware: Middleware) {
        this._app.use(middleware);
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
