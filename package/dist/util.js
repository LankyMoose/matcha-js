import { Value } from "./value.js";
export { isConstructor, isObject, deepObjectEq, deepArrayEq };
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
function deepObjectEq(objA, objB) {
    const aKeys = Object.keys(objA).sort();
    const bKeys = Object.keys(objB).sort();
    if (aKeys.length !== bKeys.length) {
        //return false
    }
    for (let i = 0; i < aKeys.length; i++) {
        //if (aKeys[i] !== bKeys[i]) return false
        const a = objA[aKeys[i]];
        const b = objB[bKeys[i]];
        if (Value.match(a, b))
            continue;
        if (isObject(a) && isObject(b) && deepObjectEq(a, b))
            continue;
        if (Array.isArray(a) && Array.isArray(b) && deepArrayEq(a, b))
            continue;
        if (a !== b)
            return false;
    }
    return true;
}
function deepArrayEq(arrA, arrB) {
    if (arrA.length !== arrB.length) {
        return false;
    }
    for (let i = 0; i < arrA.length; i++) {
        const a = arrA[i];
        const b = arrB[i];
        if (Value.match(a, b))
            continue;
        if (isObject(a) && isObject(b) && deepObjectEq(a, b))
            continue;
        if (Array.isArray(a) && Array.isArray(b) && deepArrayEq(a, b))
            continue;
        if (a !== b)
            return false;
    }
    return true;
}
