export { type, optional, nullable, Value, _, isObject, isConstructor, deepObjectEq, deepArrayEq, };
class Value {
    constructor() {
        // @ts-expect-error
        Object.defineProperty(this, "isSpread", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
    }
    static match(lhs, val) {
        if (typeof lhs !== "object")
            return false;
        if (AnyValue.isAnyValue(lhs))
            return true;
        if (TypedValue.isTypedValue(lhs))
            return lhs.match(val);
        if (OptionalValue.isOptionalValue(lhs))
            return lhs.match(val);
        if (NullableValue.isNullableValue(lhs))
            return lhs.match(val);
        return false;
    }
    [Symbol.iterator]() {
        let i = 0;
        return {
            next: () => {
                if (i === 0) {
                    i++;
                    this.isSpread = true;
                    return { value: this, done: false };
                }
                return { value: undefined, done: true };
            },
        };
    }
}
class AnyValue extends Value {
    get [Symbol.toStringTag]() {
        return "MatchaAny";
    }
    static isAnyValue(val) {
        return val.toString() === "[object MatchaAny]";
    }
}
const _ = new AnyValue();
class TypedValue extends Value {
    constructor(...classRefs) {
        super();
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
class OptionalValue extends Value {
    constructor(...classRefs) {
        super();
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
class NullableValue extends Value {
    constructor(...classRefs) {
        super();
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
    return classRefs.some((classRef) => matchType(val, classRef));
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
function deepObjectEq(pattern, value) {
    const pKeys = Object.keys(pattern).sort();
    const vKeys = Object.keys(value).sort();
    let optionalCount = 0;
    for (let i = 0; i < pKeys.length; i++) {
        const pVal = pattern[pKeys[i]];
        const vVal = value[vKeys[i]];
        if (vKeys[i] === undefined) {
            if (OptionalValue.isOptionalValue(pVal)) {
                optionalCount++;
            }
            else {
                return false;
            }
        }
        if (Value.match(pVal, vVal))
            continue;
        if (isObject(pVal) && isObject(vVal) && deepObjectEq(pVal, vVal))
            continue;
        if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(pVal, vVal))
            continue;
        if (pVal !== vVal)
            return false;
    }
    if (pKeys.length - optionalCount !== vKeys.length) {
        return false;
    }
    return true;
}
function deepArrayEq(pattern, value) {
    let optionalCount = 0;
    for (let i = 0; i < pattern.length; i++) {
        const pItem = pattern[i];
        const vItem = value[i];
        if (Value.match(pItem, vItem)) {
            if (OptionalValue.isOptionalValue(pItem)) {
                optionalCount++;
            }
            continue;
        }
        if (isObject(pItem) && isObject(vItem) && deepObjectEq(pItem, vItem))
            continue;
        if (Array.isArray(pItem) &&
            Array.isArray(vItem) &&
            deepArrayEq(pItem, vItem))
            continue;
        if (pItem !== vItem)
            return false;
    }
    if (pattern.length - optionalCount !== value.length) {
        return false;
    }
    return true;
}
