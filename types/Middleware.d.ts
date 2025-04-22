import { HttpContext } from "../interfaces/HttpContext";

export type Middleware = (ctx: HttpContext, next: () => Promise<void>) => Promise<void> | void;
