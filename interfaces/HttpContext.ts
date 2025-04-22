import { IncomingMessage, ServerResponse } from "http";

export interface HttpContext {
    Request: IncomingMessage;
    Response: ServerResponse;
    params: Record<string, string>;
    body?: any;
}
