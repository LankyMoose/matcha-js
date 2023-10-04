export { isConstructor, isObject, deepObjectEq, deepArrayEq };
declare function isConstructor(value: any): value is new (...args: any[]) => any;
type Obj = Record<string | symbol | number, unknown>;
declare function isObject(value: any): value is Obj;
declare function deepObjectEq(objA: Obj, objB: Obj): boolean;
declare function deepArrayEq(arrA: Array<unknown>, arrB: Array<unknown>): boolean;
