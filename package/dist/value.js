import { isObject } from "./util.js";
export { pattern, any, AnyValue };
class AnyValue {
    constructor(match) {
        Object.defineProperty(this, "match", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: match
        });
        Object.defineProperty(this, "__isAny", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static isAnyValue(val) {
        return typeof val === "object" && val.__isAny;
    }
}
function pattern(regex) {
    return new AnyValue((val) => typeof val === "string" && regex.test(val));
}
function any(classRef) {
    switch (classRef) {
        case String:
            return new AnyValue((val) => typeof val === "string");
        case Number:
            return new AnyValue((val) => typeof val === "number");
        case Boolean:
            return new AnyValue((val) => typeof val === "boolean");
        case BigInt:
            return new AnyValue((val) => typeof val === "bigint");
        case Symbol:
            return new AnyValue((val) => typeof val === "symbol");
        case Array:
            return new AnyValue((val) => Array.isArray(val));
        case Object:
            return new AnyValue((val) => isObject(val));
        case Error:
            return new AnyValue((val) => val instanceof Error);
        case Promise:
            return new AnyValue((val) => val instanceof Promise);
        case Date:
            return new AnyValue((val) => val instanceof Date);
        default:
            return new AnyValue((val) => val instanceof classRef);
    }
}
