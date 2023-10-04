import { isObject } from "./util.js";
export { any, AnyValue, _, DefaultValue };
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
        return typeof val === "object" && "__isAny" in val;
    }
}
class DefaultValue {
    constructor() {
        Object.defineProperty(this, "__isDefault", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static isDefaultValue(val) {
        return typeof val === "object" && "__isDefault" in val;
    }
}
const _ = new DefaultValue();
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
