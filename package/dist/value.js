export { type, optional, nullable, Value, _, isObject, isConstructor, deepObjectEq, deepArrayEq, };
class Value {
    static match(lhs, val) {
        if (typeof lhs !== "object")
            return false;
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
    get [Symbol.toStringTag]() {
        return "MatchaAny";
    }
    static isAnyValue(val) {
        return val.toString() === "[object MatchaAny]";
    }
}
const _ = new AnyValue();
class TypedValue {
    constructor(...classRefs) {
        Object.defineProperty(this, "classRefs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.classRefs = classRefs;
    }
    get [Symbol.toStringTag]() {
        return "MatchaTyped";
    }
    static isTypedValue(val) {
        return val.toString() === "[object MatchaTyped]";
    }
    match(val) {
        return matchTypes(val, this.classRefs);
    }
}
class OptionalValue {
    constructor(...classRefs) {
        Object.defineProperty(this, "classRefs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.classRefs = classRefs;
    }
    get [Symbol.toStringTag]() {
        return "MatchaOptional";
    }
    static isOptionalValue(val) {
        return val.toString() === "[object MatchaOptional]";
    }
    match(val) {
        if (val === undefined)
            return true;
        if (val === null)
            return false; // null is not optional
        return matchTypes(val, this.classRefs);
    }
}
class NullableValue {
    constructor(...classRefs) {
        Object.defineProperty(this, "classRefs", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.classRefs = classRefs;
    }
    get [Symbol.toStringTag]() {
        return "MatchaNullable";
    }
    static isNullableValue(val) {
        return val.toString() === "[object MatchaNullable]";
    }
    match(val) {
        if (val === null)
            return true;
        if (val === undefined)
            return false; // undefined is not nullable
        return matchTypes(val, this.classRefs);
    }
}
function optional(...classRefs) {
    return new OptionalValue(...classRefs);
}
function type(...classRefs) {
    return new TypedValue(...classRefs);
}
function nullable(...classRefs) {
    return new NullableValue(...classRefs);
}
function matchTypes(val, classRefs) {
    for (const classRef of classRefs) {
        if (matchType(val, classRef))
            return true;
    }
    return false;
}
function matchType(val, classRef) {
    switch (classRef) {
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
            return val instanceof classRef;
    }
}
function isConstructor(value) {
    return (typeof value === "function" &&
        value.prototype &&
        value.prototype.constructor === value);
}
function isObject(value) {
    return (typeof value === "object" &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof Promise));
}
function deepObjectEq(a, b) {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    let optionalCount = 0;
    for (let i = 0; i < aKeys.length; i++) {
        const aVal = a[aKeys[i]];
        const bVal = b[bKeys[i]];
        if (bKeys[i] === undefined) {
            if (OptionalValue.isOptionalValue(aVal)) {
                optionalCount++;
            }
            else {
                return false;
            }
        }
        if (Value.match(aVal, bVal))
            continue;
        if (isObject(aVal) && isObject(bVal) && deepObjectEq(aVal, bVal))
            continue;
        if (Array.isArray(aVal) && Array.isArray(bVal) && deepArrayEq(aVal, bVal))
            continue;
        if (aVal !== bVal)
            return false;
    }
    if (aKeys.length - optionalCount !== bKeys.length) {
        return false;
    }
    return true;
}
function deepArrayEq(a, b) {
    let optionalCount = 0;
    for (let i = 0; i < a.length; i++) {
        const aVal = a[i];
        const bVal = b[i];
        if (Value.match(aVal, bVal)) {
            if (OptionalValue.isOptionalValue(aVal)) {
                optionalCount++;
            }
            continue;
        }
        if (isObject(aVal) && isObject(bVal) && deepObjectEq(aVal, bVal))
            continue;
        if (Array.isArray(aVal) && Array.isArray(bVal) && deepArrayEq(aVal, bVal))
            continue;
        if (aVal !== bVal)
            return false;
    }
    if (a.length - optionalCount !== b.length) {
        return false;
    }
    return true;
}
