import { IncomingMessage } from "http";
import { getRawBody } from "./getRawBody";

export async function parseJsonBody(req: IncomingMessage): Promise<any> {
    let body = await getRawBody(req);
    const contentType = req.headers["content-type"] ?? "";

    try {
        if (contentType.includes("application/json")) {
            return JSON.parse(body);
        }
        return body;
    } catch (e) {
        throw new Error(`Failed to parse body: ${(e as Error).message}`);
    }
}
