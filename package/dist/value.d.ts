import { ClassRef, Obj } from "./types.js";
export { type, optional, nullable, Value, _, isObject, isConstructor, deepObjectEq, deepArrayEq, };
declare class Value {
    private isSpread;
    static match<T>(lhs: any, val: T): boolean;
    [Symbol.iterator](): Iterator<Value>;
}
declare class AnyValue extends Value {
    get [Symbol.toStringTag](): string;
    static isAnyValue(val: any): val is AnyValue;
}
declare const _: AnyValue;
declare class TypedValue<T> extends Value {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<T>[]);
    get [Symbol.toStringTag](): string;
    static isTypedValue(val: any): val is TypedValue<any>;
    match(val: any): boolean;
}
declare class OptionalValue<T> extends Value {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<T>[]);
    get [Symbol.toStringTag](): string;
    static isOptionalValue(val: any): val is OptionalValue<any>;
    match(val: any): boolean;
}
declare class NullableValue<T = void> extends Value {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<T>[]);
    get [Symbol.toStringTag](): string;
    static isNullableValue(val: any): val is NullableValue<any>;
    match(val: any): boolean;
}
declare function optional<T>(...classRefs: ClassRef<T>[]): OptionalValue<T>;
declare function type<T>(...classRefs: ClassRef<T>[]): TypedValue<T>;
declare function nullable<T>(...classRefs: ClassRef<T>[]): NullableValue<T>;
declare function isConstructor(value: any): value is new (...args: any[]) => any;
declare function isObject(value: any): value is Obj;
declare function deepObjectEq(pattern: Obj, value: Obj): boolean;
declare function deepArrayEq(pattern: Array<unknown>, value: Array<unknown>): boolean;
