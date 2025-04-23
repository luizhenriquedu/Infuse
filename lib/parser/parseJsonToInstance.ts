import { Constructor } from "../../types/Constructor";
import { FromBodyParam } from "../../types/ControllerBodyMetadata";
import { isPrimitiveType } from "../utils/isTypePrimitive";

export function parseJsonToInstance<T extends Object>(type: Constructor<T>, bodyData: any, fromBody: FromBodyParam) {
    let instance = new type();
    Object.keys(bodyData).forEach((key) => {
        if (isPrimitiveType(type)) {
            if (fromBody.key) {
                return (instance = bodyData[fromBody.key || "defaultKey"]);
            }
        }
        if (Object.prototype.hasOwnProperty.call(instance, key)) {
            console.log(instance);
            instance[key as keyof typeof instance] = bodyData[key];
        }
    });

    return instance;
}
