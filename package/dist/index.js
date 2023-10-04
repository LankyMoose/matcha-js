import { isObject, isConstructor } from "./util.js";
import { AnyValue } from "./value.js";
export * from "./value.js";
export { match, PatternMatcher };
class PatternMatcher {
    constructor(value, patterns) {
        Object.defineProperty(this, "matched", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        let match;
        for (const pattern of patterns) {
            const [lhs] = pattern;
            switch (typeof value) {
                case "string":
                    this.matched =
                        lhs === String || (typeof lhs === "string" && lhs === value);
                    break;
                case "number":
                    this.matched =
                        lhs === Number || (typeof lhs === "number" && lhs === value);
                    break;
                case "boolean":
                    this.matched =
                        lhs === Boolean || (typeof lhs === "boolean" && lhs === value);
                    break;
                case "bigint":
                    this.matched =
                        lhs === BigInt || (typeof lhs === "bigint" && lhs === value);
                    break;
                case "symbol":
                    this.matched =
                        lhs === Symbol || (typeof lhs === "symbol" && lhs === value);
                    break;
                case "function":
                    this.matched =
                        lhs === Function || (typeof lhs === "function" && lhs === value);
                    break;
                default:
                    break;
            }
            if (AnyValue.isAnyValue(lhs))
                this.matched = lhs.match(value);
            if (this.matched) {
                match = pattern;
                break;
            }
            for (const classRef of [Error, Promise, Date]) {
                if (value instanceof classRef) {
                    this.matched = lhs === classRef || lhs === value.constructor;
                    if (this.matched) {
                        match = pattern;
                        break;
                    }
                }
            }
            if (value === null || value === undefined) {
                this.matched = lhs === value;
                if (this.matched) {
                    match = pattern;
                    break;
                }
            }
            if (Array.isArray(value)) {
                if (lhs === Array) {
                    this.matched = true;
                }
                else if (Array.isArray(lhs)) {
                    this.matched =
                        lhs.length === value.length &&
                            lhs.every((p, i) => p === value[i] || (p instanceof AnyValue && p.match(value[i])));
                }
                else {
                    continue;
                }
                if (this.matched) {
                    match = pattern;
                    break;
                }
            }
            if (isObject(value)) {
                if (isConstructor(lhs)) {
                    this.matched = value instanceof lhs;
                    if (this.matched) {
                        match = pattern;
                        break;
                    }
                }
                if (lhs === Object) {
                    this.matched = true;
                }
                else if (isObject(lhs)) {
                    const aKeys = Object.keys(value);
                    const bKeys = Object.keys(lhs);
                    this.matched =
                        aKeys.length === bKeys.length &&
                            aKeys.every((p) => lhs[p] === value[p] ||
                                (lhs[p] instanceof AnyValue && lhs[p].match(value[p])));
                }
                else {
                    continue;
                }
                if (this.matched) {
                    match = pattern;
                    break;
                }
            }
        }
        match && match[1]();
    }
    orElse(fallback) {
        if (this.matched)
            return this;
        fallback();
        return this;
    }
}
function match(x) {
    return {
        with: (...patterns) => new PatternMatcher(x, patterns),
    };
}
