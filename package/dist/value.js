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
export { type, optional, nullable, Value, _, omniMatch };
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
            return true;
        if (TypedValue.isTypedValue(value))
            return value.match(val);
        if (OptionalValue.isOptionalValue(value))
            return value.match(val);
        if (NullableValue.isNullableValue(value))
            return value.match(val);
        return false;
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
    const isPartial = AnyValue.isPartialObject(pattern);
    const pKeys = Object.keys(pattern).sort();
    const vKeys = Object.keys(value).sort();
    for (let i = 0; i < vKeys.length; i++) {
        const vKey = vKeys[i];
        const pVal = pattern[vKey];
        const vVal = value[vKey];
        if (pVal === undefined) {
            if (isPartial && vVal !== undefined) {
                continue;
            }
            return false;
        }
        if (Value.isValue(pVal)) {
            if (!Value.match(pVal, vVal))
                return false;
            continue;
        }
        if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(pVal, vVal)) {
            continue;
        }
        if (isObject(pVal) && isObject(vVal) && deepObjectEq(pVal, vVal)) {
            continue;
        }
        console.log(pVal, vVal);
        if (pVal !== vVal)
            return false;
    }
    const pOnlyKeys = pKeys.filter((key) => !vKeys.includes(key));
    if (pOnlyKeys.length > 0) {
        for (let i = 0; i < pOnlyKeys.length; i++) {
            const pVal = pattern[pOnlyKeys[i]];
            const vVal = value[pOnlyKeys[i]];
            if (vVal === undefined) {
                if (!OptionalValue.isOptionalValue(pVal))
                    return false;
                continue;
            }
            if (Value.isValue(pVal)) {
                if (!Value.match(pVal, vVal))
                    return false;
                continue;
            }
            if (Array.isArray(pVal) && Array.isArray(vVal)) {
                if (!deepArrayEq(pVal, vVal))
                    return false;
                continue;
            }
            if (isObject(pVal) && isObject(vVal)) {
                if (!deepObjectEq(pVal, vVal))
                    return false;
                continue;
            }
            if (pVal !== vVal)
                continue;
        }
    }
    return true;
}
function deepArrayEq(pattern, value) {
    let pi = 0;
    let vi = 0;
    while (pi < pattern.length || vi < value.length) {
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
                return false;
            }
            pi++;
            if (pi > value.length)
                return false;
            if (pi > pattern.length)
                return false;
            continue;
        }
        if (isObject(pItem) && isObject(vItem)) {
            if (!deepObjectEq(pItem, vItem))
                return false;
            pi++;
            vi++;
            continue;
        }
        if (Array.isArray(pItem) && Array.isArray(vItem) && deepArrayEq(pItem, vItem)) {
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
                return false;
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
            if (Array.isArray(pItem) && Array.isArray(vItem) && deepArrayEq(pItem, vItem)) {
                pi++;
                vi++;
                continue;
            }
            if (Value.isValue(pItem) && Value.match(pItem, vItem)) {
                pi++;
                vi++;
                continue;
            }
            if (isObject(pItem) && isObject(vItem) && deepObjectEq(pItem, vItem)) {
                pi++;
                vi++;
                continue;
            }
            return false;
        }
    }
    return true;
}
function primitiveMatch(value, pattern) {
    switch (typeof value) {
        case "string":
            if (pattern === String ||
                (typeof pattern === "string" && pattern === value) ||
                (pattern instanceof RegExp && pattern.test(value)))
                return true;
            break;
        case "number":
            if (pattern === Number || (typeof pattern === "number" && pattern === value))
                return true;
            break;
        case "boolean":
            if (pattern === Boolean || (typeof pattern === "boolean" && pattern === value))
                return true;
            break;
        case "bigint":
            if (pattern === BigInt || (typeof pattern === "bigint" && pattern === value))
                return true;
            break;
        case "symbol":
            if (pattern === Symbol || (typeof pattern === "symbol" && pattern === value))
                return true;
            break;
        case "function":
            if (pattern === Function || (typeof pattern === "function" && pattern === value))
                return true;
            break;
        default:
            break;
    }
    return false;
}
function objectMatch(value, pattern) {
    if (!isObject(value))
        return false;
    if (pattern === Object)
        return true;
    if (isConstructor(pattern) && value instanceof pattern)
        return true;
    return isObject(pattern) && deepObjectEq(pattern, value);
}
function omniMatch(value, pattern) {
    return (value === pattern ||
        primitiveMatch(value, pattern) ||
        objectMatch(value, pattern) ||
        arrayMatch(value, pattern) ||
        (Value.isValue(pattern) && Value.match(pattern, value)) ||
        objectMatch(value, pattern));
}
function arrayMatch(value, pattern) {
    if (!Array.isArray(value))
        return false;
    if (pattern === Array)
        return true;
    return Array.isArray(pattern) && deepArrayEq(pattern, value);
}
