import { IncomingMessage } from "http";

export async function bodyParser(req: IncomingMessage): Promise<any> {
    return new Promise((resolve, reject) => {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            const contentType = req.headers["content-type"];
            try {
                if (contentType?.includes("application/json")) {
                    resolve(JSON.parse(body));
                } else if (contentType?.includes("application/x-www-form-urlencoded")) {
                    const params = new URLSearchParams(body);
                    const result: Record<string, string> = {};
                    for (const [key, value] of params.entries()) {
                        result[key] = value;
                    }
                    resolve(params);
                } else {
                    resolve(body);
                }
            } catch (err) {
                reject(err);
            }
        });
        req.on("error", reject);
    });
}
