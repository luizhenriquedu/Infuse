import { IncomingMessage } from "http";

export async function bodyParser(req: IncomingMessage): Promise<any> {
    let body = await getRawBody(req);
    const contentType = req.headers["content-type"] ?? "";

    try {
        if (contentType.includes("application/json")) {
            return JSON.parse(body);
        }
        if (contentType.includes("application/x-www-form-urlencoded")) {
            const params = new URLSearchParams(body);
            return Object.fromEntries(params);
        }
        return body;
    } catch (e) {
        throw new Error(`Failed to parse body: ${(e as Error).message}`);
    }
}

function getRawBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = "";

        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", (e) => reject(e));
    });
}
