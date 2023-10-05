import { Value, isObject, isConstructor, deepObjectEq, deepArrayEq, } from "./value.js";
export * from "./value.js";
export { match };
function matchSuccess(pattern, value) {
    return typeof pattern[1] === "function" ? pattern[1](value) : pattern[1];
}
function match(value) {
    return (...patterns) => {
        for (const pattern of patterns) {
            const [lhs] = pattern;
            switch (typeof value) {
                case "string":
                    if (lhs === String ||
                        (typeof lhs === "string" && lhs === value) ||
                        (lhs instanceof RegExp && lhs.test(value)))
                        return matchSuccess(pattern, value);
                    break;
                case "number":
                    if (lhs === Number || (typeof lhs === "number" && lhs === value))
                        return matchSuccess(pattern, value);
                    break;
                case "boolean":
                    if (lhs === Boolean || (typeof lhs === "boolean" && lhs === value))
                        return matchSuccess(pattern, value);
                    break;
                case "bigint":
                    if (lhs === BigInt || (typeof lhs === "bigint" && lhs === value))
                        return matchSuccess(pattern, value);
                    break;
                case "symbol":
                    if (lhs === Symbol || (typeof lhs === "symbol" && lhs === value))
                        return matchSuccess(pattern, value);
                    break;
                case "function":
                    if (lhs === Function || (typeof lhs === "function" && lhs === value))
                        return matchSuccess(pattern, value);
                    break;
                default:
                    break;
            }
            if (Value.match(lhs, value))
                return matchSuccess(pattern, value);
            for (const classRef of [Error, Promise, Date]) {
                if (value instanceof classRef) {
                    if (lhs === classRef || lhs === value.constructor)
                        return matchSuccess(pattern, value);
                }
            }
            if (value === null || value === undefined) {
                if (lhs === value)
                    return matchSuccess(pattern, value);
            }
            if (Array.isArray(value)) {
                if (lhs === Array) {
                    return matchSuccess(pattern, value);
                }
                else if (Array.isArray(lhs)) {
                    if (deepArrayEq(lhs, value))
                        return matchSuccess(pattern, value);
                }
                else {
                    continue;
                }
            }
            if (isObject(value)) {
                if (lhs === Object) {
                    return matchSuccess(pattern, value);
                }
                else if (isConstructor(lhs)) {
                    if (value instanceof lhs)
                        return matchSuccess(pattern, value);
                }
                else if (isObject(lhs)) {
                    if (deepObjectEq(lhs, value))
                        return matchSuccess(pattern, value);
                }
                else {
                    continue;
                }
            }
        }
        throw new Error("No match found");
    };
}
