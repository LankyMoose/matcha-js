export { isConstructor, isObject };
declare function isConstructor(value: any): value is new (...args: any[]) => any;
declare function isObject(value: any): value is Object;
