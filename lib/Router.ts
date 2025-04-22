import { Method, RouteNode } from "../types/Route";

export class Router {
    root = new Map<Method, RouteNode>();

    add(method: Method, path: string, handler: Function) {
        if (!this.root.has(method)) {
            this.root.set(method, { children: new Map<string, RouteNode>() });
        }
        let node = this.root.get(method) as RouteNode;
        const segments = path.split("/").filter(Boolean);
        for (const segment of segments) {
            if (segment.startsWith(":")) {
                if (!node.paramChild) {
                    node.paramChild = { children: new Map(), paramName: segment.slice(1) };
                }
                node = node.paramChild;
            } else if (segment == "*") {
                if (!node.wildcardChild) {
                    node.wildcardChild = { children: new Map() };
                }
                node = node.wildcardChild as RouteNode;
                break;
            } else {
                if (!node.children.has(segment)) {
                    node.children.set(segment, { children: new Map() });
                }
                node = node.children.get(segment)!;
            }
        }
        node.handler = handler;
    }

    find(method: Method, path: string): { handler: Function; params: Record<string, string> } | null {
        let node = this.root.get(method);
        if (!node) {
            return null;
        }

        const segments = path.split("/").filter(Boolean);
        const params: Record<string, string> = {};
        const match = this._matchNode(node, segments, 0, params);
        return match?.handler ? { handler: match.handler, params } : null;
    }

    private _matchNode(
        node: RouteNode,
        segments: string[],
        index: number,
        params: Record<string, string>
    ): RouteNode | null {
        if (index === segments.length) {
            return node.handler ? node : null;
        }
        const segment = segments[index];

        const segmentChild = node.children.get(segment);
        if (segmentChild) {
            const match = this._matchNode(segmentChild, segments, index + 1, params);

            if (match) return match;
        }
        if (node.paramChild) {
            params[node.paramChild.paramName!] = segment;
            const match = this._matchNode(node.paramChild, segments, index + 1, params);
            if (match) return match;
            delete params[node.paramChild.paramName!];
        }

        if (node.wildcardChild) {
            return node.wildcardChild.handler ? node.wildcardChild : null;
        }
        return null;
    }
}
