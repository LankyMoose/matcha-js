export { isConstructor, isObject, deepObjectEq, deepArrayEq };
declare function isConstructor(value: any): value is new (...args: any[]) => any;
declare function isObject(value: any): value is Object;
declare function deepObjectEq(objA: Object, objB: Object): boolean;
declare function deepArrayEq(arrA: Array<unknown>, arrB: Array<unknown>): boolean;
