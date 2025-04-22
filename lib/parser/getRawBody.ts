import { IncomingMessage } from "http";

export function getRawBody(req: IncomingMessage): Promise<string> {
    return new Promise((resolve, reject) => {
        let data = "";

        req.on("data", (chunk) => (data += chunk));
        req.on("end", () => resolve(data));
        req.on("error", (e) => reject(e));
    });
}
