var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Value__isSpread, _a;
export { type, optional, nullable, Value, AnyValue, NullableValue, OptionalValue, TypedValue, _, omniMatch, anySymbol, };
class Value {
    constructor() {
        _Value__isSpread.set(this, false);
    }
    get isSpread() {
        return __classPrivateFieldGet(this, _Value__isSpread, "f");
    }
    static isValue(val) {
        if (typeof val !== "object")
            return false;
        return (AnyValue.isAnyValue(val) ||
            TypedValue.isTypedValue(val) ||
            OptionalValue.isOptionalValue(val) ||
            NullableValue.isNullableValue(val));
    }
    static match(value, val) {
        if (AnyValue.isAnyValue(value))
            return { value };
        if (TypedValue.isTypedValue(value) ||
            OptionalValue.isOptionalValue(value) ||
            NullableValue.isNullableValue(value))
            return value.match(val);
    }
    [(_Value__isSpread = new WeakMap(), Symbol.iterator)]() {
        let i = 0;
        return {
            next: () => {
                if (i === 0) {
                    i++;
                    __classPrivateFieldSet(this, _Value__isSpread, true, "f");
                    return { value: this, done: false };
                }
                return { value: undefined, done: true };
            },
        };
    }
}
const anySymbol = Symbol("matcha_any");
class AnyValue extends Value {
    constructor() {
        super(...arguments);
        // @ts-expect-error
        Object.defineProperty(this, _a, {
            enumerable: true,
            configurable: true,
            writable: true,
            value: true
        });
    }
    get [(_a = anySymbol, Symbol.toStringTag)]() {
        return "MatchaAny";
    }
    static isAnyValue(val) {
        return val.toString() === "[object MatchaAny]";
    }
    static isPartialObject(val) {
        // check if the object has the anySymbol property
        return anySymbol in val;
    }
}
const _ = new AnyValue();
class TypedValue extends Value {
    constructor(classRef) {
        super();
        Object.defineProperty(this, "classRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: classRef
        });
    }
    get [Symbol.toStringTag]() {
        return "MatchaTyped";
    }
    static isTypedValue(val) {
        return val.toString() === "[object MatchaTyped]";
    }
    match(val) {
        return matchType(val, this.classRef);
    }
}
class OptionalValue extends Value {
    constructor(classRef) {
        super();
        Object.defineProperty(this, "classRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: classRef
        });
    }
    get [Symbol.toStringTag]() {
        return "MatchaOptional";
    }
    static isOptionalValue(val) {
        return val.toString() === "[object MatchaOptional]";
    }
    match(value) {
        if (value === undefined)
            return { value };
        if (value === null)
            return; // null is not optional
        return matchType(value, this.classRef);
    }
}
class NullableValue extends Value {
    constructor(classRef) {
        super();
        Object.defineProperty(this, "classRef", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: classRef
        });
    }
    get [Symbol.toStringTag]() {
        return "MatchaNullable";
    }
    static isNullableValue(val) {
        return val.toString() === "[object MatchaNullable]";
    }
    match(value) {
        if (value === null)
            return { value };
        if (value === undefined)
            return; // undefined is not nullable
        return matchType(value, this.classRef);
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
function matchType(value, classRef) {
    switch (classRef) {
        case String:
            if (typeof value === "string")
                return { value };
            break;
        case Number:
            if (typeof value === "number")
                return { value };
            break;
        case Boolean:
            if (typeof value === "boolean")
                return { value };
            break;
        case BigInt:
            if (typeof value === "bigint")
                return { value };
            break;
        case Symbol:
            if (typeof value === "symbol")
                return { value };
            break;
        case Array:
            if (Array.isArray(value))
                return { value };
            break;
        case Object:
            if (isObject(value))
                return { value };
            break;
        case Error:
            if (value instanceof Error)
                return { value };
            break;
        case Promise:
            if (value instanceof Promise)
                return { value };
            break;
        case Date:
            if (value instanceof Date)
                return { value };
            break;
        default:
            if (value instanceof classRef)
                return { value };
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
function deepObjectEq(value, pattern) {
    const isPartial = AnyValue.isPartialObject(pattern);
    const pKeys = Object.keys(pattern);
    if (isPartial) {
        for (let i = 0; i < pKeys.length; i++) {
            const pKey = pKeys[i];
            const pVal = pattern[pKey];
            const vVal = value[pKey];
            if (pVal === undefined) {
                if (isPartial)
                    continue;
                return;
            }
            if (pVal === null) {
                if (vVal !== null)
                    return;
                continue;
            }
            if (Value.isValue(pVal)) {
                if (!Value.match(pVal, vVal))
                    return;
                continue;
            }
            if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(vVal, pVal)) {
                continue;
            }
            if (isObject(pVal) && isObject(vVal) && deepObjectEq(vVal, pVal)) {
                continue;
            }
            if (pVal !== vVal)
                return;
        }
    }
    else {
        const vKeys = Object.keys(value).sort();
        for (let i = 0; i < vKeys.length; i++) {
            const vKey = vKeys[i];
            const pVal = pattern[vKey];
            const vVal = value[vKey];
            if (pVal === undefined) {
                if (isPartial)
                    continue;
                return;
            }
            if (pVal === null) {
                if (vVal !== null)
                    return;
                continue;
            }
            if (Value.isValue(pVal)) {
                if (!Value.match(pVal, vVal))
                    return;
                continue;
            }
            if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(vVal, pVal)) {
                continue;
            }
            if (isObject(pVal) && isObject(vVal) && deepObjectEq(vVal, pVal)) {
                continue;
            }
            if (pVal !== vVal)
                return;
        }
        const pOnlyKeys = pKeys.filter((key) => !vKeys.includes(key));
        if (pOnlyKeys.length > 0) {
            for (let i = 0; i < pOnlyKeys.length; i++) {
                const pVal = pattern[pOnlyKeys[i]];
                if (pVal === undefined || pVal === null)
                    return;
                if (OptionalValue.isOptionalValue(pVal))
                    continue;
                return;
            }
        }
    }
    return { value };
}
function deepArrayEq(value, pattern) {
    let pi = 0;
    let vi = 0;
    while (pi < pattern.length || vi < value.length) {
        if (vi > value.length)
            return;
        const pItem = pattern[pi];
        const vItem = value[vi];
        if (Value.isValue(pItem)) {
            const nextPatternItem = pattern[pi + 1];
            if (Value.match(pItem, vItem)) {
                if (pItem.isSpread) {
                    vi++;
                    // if the next pattern item is not a spread and would match with this value item
                    // then we need to end this spread
                    //eg:
                    // val = ["start", "started", "going", "ending", "ended"]
                    // pattern = ["start", ...type(String), "going", ...type(String)]
                    if (Value.isValue(nextPatternItem) && nextPatternItem.isSpread) {
                    }
                    else {
                        if (omniMatch(vItem, nextPatternItem)) {
                            pi++;
                            vi--;
                        }
                    }
                    continue;
                }
                pi++;
                vi++;
                continue;
            }
            if (!omniMatch(vItem, nextPatternItem)) {
                return;
            }
            pi++;
            if (pi > value.length)
                return;
            if (pi > pattern.length)
                return;
            continue;
        }
        if (isObject(pItem) && isObject(vItem)) {
            if (!deepObjectEq(vItem, pItem))
                return;
            pi++;
            vi++;
            continue;
        }
        if (Array.isArray(pItem) && Array.isArray(vItem)) {
            if (!deepArrayEq(vItem, pItem))
                return;
            pi++;
            vi++;
            continue;
        }
        if (pItem === vItem) {
            pi++;
            vi++;
            continue;
        }
        else {
            if (!pItem)
                return;
            // handle cases where:
            // value = ["start", "middle", "end", "the very end"]
            // pattern = [...type(String), "end", "the very end"]
            // or:
            // value = ["start", "middle", "end", "the very end", "just kidding"]
            // pattern = ["start", ...type(String), "end", "the very end"]
            const pItemDistToEnd = pattern.length - pi;
            let vIdx = value.length - pItemDistToEnd;
            const vItem = value[vIdx];
            if (vItem === pItem) {
                pi++;
                vi++;
                continue;
            }
            if (primitiveMatch(vItem, pItem)) {
                pi++;
                vi++;
                continue;
            }
            if (Array.isArray(pItem) && Array.isArray(vItem)) {
                if (!deepArrayEq(vItem, pItem))
                    return;
                pi++;
                vi++;
                continue;
            }
            if (Value.isValue(pItem) && Value.match(pItem, vItem)) {
                pi++;
                vi++;
                continue;
            }
            if (isObject(pItem) && isObject(vItem)) {
                if (!deepObjectEq(vItem, pItem))
                    return;
                pi++;
                vi++;
                continue;
            }
            return;
        }
    }
    return { value };
}
function primitiveMatch(value, pattern) {
    switch (typeof value) {
        case "string":
            if (pattern === String || (typeof pattern === "string" && pattern === value))
                return { value };
            if (pattern instanceof RegExp) {
                const match = pattern.exec(value);
                if (match)
                    return { value: match };
            }
            break;
        case "number":
            if (pattern === Number || (typeof pattern === "number" && pattern === value))
                return { value };
            break;
        case "boolean":
            if (pattern === Boolean || (typeof pattern === "boolean" && pattern === value))
                return { value };
            break;
        case "bigint":
            if (pattern === BigInt || (typeof pattern === "bigint" && pattern === value))
                return { value };
            break;
        case "symbol":
            if (pattern === Symbol || (typeof pattern === "symbol" && pattern === value))
                return { value };
            break;
        case "function":
            if (pattern === Function || (typeof pattern === "function" && pattern === value))
                return { value };
            break;
        default:
            break;
    }
}
function arrayMatch(value, pattern) {
    if (!Array.isArray(value))
        return;
    if (pattern === Array)
        return { value };
    if (Array.isArray(pattern))
        return deepArrayEq(value, pattern);
}
function objectMatch(value, pattern) {
    if (!isObject(value))
        return;
    if (pattern === Object)
        return { value };
    if (isConstructor(pattern) && value instanceof pattern)
        return { value };
    if (isObject(pattern))
        return deepObjectEq(value, pattern);
}
function valueMatch(value, pattern) {
    if (Value.isValue(pattern))
        return Value.match(pattern, value);
}
function omniMatch(value, pattern) {
    return value === pattern
        ? { value }
        : primitiveMatch(value, pattern) ||
            arrayMatch(value, pattern) ||
            valueMatch(value, pattern) ||
            objectMatch(value, pattern);
}
