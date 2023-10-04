import { isObject } from "./util.js";
export { type, optional, nullable, Value, _ };
class Value {
    static match(lhs, val) {
        if (AnyValue.isAnyValue(lhs))
            return true;
        if (TypedValue.isTypedValue(lhs) && lhs.match(val))
            return true;
        if (OptionalValue.isOptionalValue(lhs) && lhs.match(val))
            return true;
        if (NullableValue.isNullableValue(lhs) && lhs.match(val))
            return true;
        return false;
    }
}
class AnyValue {
    constructor() {
        // @ts-expect-error
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
const _ = new AnyValue();
class TypedValue {
    constructor(classRef) {
        Object.defineProperty(this, "classRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: classRef
        });
        // @ts-expect-error
        Object.defineProperty(this, "__isOfType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static isTypedValue(val) {
        return typeof val === "object" && "__isOfType" in val;
    }
    match(val) {
        return matchType(this.classRef, val);
    }
}
class OptionalValue {
    constructor(classRef) {
        Object.defineProperty(this, "classRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: classRef
        });
        // @ts-expect-error
        Object.defineProperty(this, "__isOptional", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static isOptionalValue(val) {
        return typeof val === "object" && "__isOptional" in val;
    }
    match(val) {
        if (val === undefined)
            return true;
        if (val === null)
            return false; // null is not optional
        return matchType(this.classRef, val);
    }
}
class NullableValue {
    constructor(classRef) {
        Object.defineProperty(this, "classRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: classRef
        });
        // @ts-expect-error
        Object.defineProperty(this, "__isNullable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    static isNullableValue(val) {
        return typeof val === "object" && "__isNullable" in val;
    }
    match(val) {
        if (val === null)
            return true;
        if (val === undefined)
            return false; // undefined is not nullable
        return matchType(this.classRef, val);
    }
}
function optional(classRef) {
    return new OptionalValue(classRef);
}
function type(classRef) {
    return new TypedValue(classRef);
}
function nullable(classRef) {
    return new NullableValue(classRef);
}
function matchType(targetClass, val) {
    switch (targetClass) {
        case String:
            return typeof val === "string";
        case Number:
            return typeof val === "number";
        case Boolean:
            return typeof val === "boolean";
        case BigInt:
            return typeof val === "bigint";
        case Symbol:
            return typeof val === "symbol";
        case Array:
            return Array.isArray(val);
        case Object:
            return isObject(val);
        case Error:
            return val instanceof Error;
        case Promise:
            return val instanceof Promise;
        case Date:
            return val instanceof Date;
        default:
            return val instanceof targetClass;
    }
}
