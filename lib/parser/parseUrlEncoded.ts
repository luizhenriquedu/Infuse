import { IncomingMessage } from "http";
import { getRawBody } from "./getRawBody";

export async function parseUrlEncoded(req: IncomingMessage): Promise<any> {
    let body = await getRawBody(req);
    const contentType = req.headers["content-type"] ?? "";

    try {
        if (contentType.includes("application/x-www-form-urlencoded")) {
            const params = new URLSearchParams(body);
            return Object.fromEntries(params);
        }
        return body;
    } catch (e) {
        throw new Error(`Failed to parse body: ${(e as Error).message}`);
    }
}
