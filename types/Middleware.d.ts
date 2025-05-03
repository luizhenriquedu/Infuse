import { HttpContext } from "../lib/classes/HttpContext";

export type Middleware = (ctx: HttpContext, next: () => Promise<void>) => Promise<void> | void;
