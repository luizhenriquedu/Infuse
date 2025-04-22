import { Constructor } from "../../types/Constructor";
import { BaseController } from "../classes/BaseController";

const container: Constructor<BaseController>[] = [];

export function addController<T extends Constructor<BaseController>>(cls: T) {
    container.push(cls);
}

export function getControllers() {
    return container;
}
