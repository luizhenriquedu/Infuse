import { Constructor } from "../../types/Constructor";

export function Service<T extends Constructor<Object>>() {
    return (target: T) => {};
}
