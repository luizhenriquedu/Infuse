import { IncomingMessage, ServerResponse } from "http";

export abstract class HttpContext {
    abstract request: IncomingMessage;
    abstract response: ServerResponse;
    abstract params: Record<string, string>;
    body?: any;
}
