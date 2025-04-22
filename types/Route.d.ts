type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export type RouteNode = {
    handler?: Function;
    children: Map<string, RouteNode>;
    paramChild?: RouteNode;
    wildcardChild?: RouteNode;
    paramName?: string;
};
