import { ClassRef, Obj } from "./types.js";
export { type, optional, nullable, Value, _, omniMatch };
declare class Value {
    #private;
    get isSpread(): boolean;
    static isValue(val: any): val is Value;
    static match<T>(value: Value, val: T): boolean;
    [Symbol.iterator](): Iterator<Value>;
}
declare const anySymbol: unique symbol;
declare class AnyValue extends Value {
    private readonly [anySymbol];
    get [Symbol.toStringTag](): string;
    static isAnyValue(val: any): val is AnyValue;
    static isPartialObject(val: Obj): boolean;
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
declare function omniMatch(value: unknown, pattern: unknown): boolean;
