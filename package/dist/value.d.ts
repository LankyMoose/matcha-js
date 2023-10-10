import { ClassRef, MatchResult, Obj } from "./types.js";
export { type, optional, nullable, Value, AnyValue, NullableValue, OptionalValue, TypedValue, _, omniMatch, anySymbol, };
declare class Value {
    #private;
    get isSpread(): boolean;
    static isValue(val: any): val is Value;
    static match<V extends Value>(value: V, val: unknown): MatchResult<V> | void;
    [Symbol.iterator](): Iterator<this>;
}
declare const anySymbol: unique symbol;
declare class AnyValue extends Value {
    private readonly [anySymbol];
    get [Symbol.toStringTag](): string;
    static isAnyValue(val: any): val is AnyValue;
    static isPartialObject(val: Obj): boolean;
}
declare const _: AnyValue;
declare class TypedValue<T extends ClassRef<unknown>> extends Value {
    private classRef;
    constructor(classRef: T);
    get [Symbol.toStringTag](): string;
    static isTypedValue(val: any): val is TypedValue<ClassRef<unknown>>;
    match(val: unknown): MatchResult<this> | void;
}
declare class OptionalValue<T extends ClassRef<unknown>> extends Value {
    private classRef;
    constructor(classRef: T);
    get [Symbol.toStringTag](): string;
    static isOptionalValue(val: any): val is OptionalValue<ClassRef<unknown>>;
    match(value: unknown): MatchResult<this> | void;
}
declare class NullableValue<T extends ClassRef<unknown>> extends Value {
    private classRef;
    constructor(classRef: T);
    get [Symbol.toStringTag](): string;
    static isNullableValue(val: any): val is NullableValue<ClassRef<unknown>>;
    match(value: unknown): MatchResult<this> | void;
}
declare function optional<T extends ClassRef<unknown>>(classRef: T): OptionalValue<T>;
declare function type<T extends ClassRef<unknown>>(classRef: T): TypedValue<T>;
declare function nullable<T extends ClassRef<unknown>>(classRef: T): NullableValue<T>;
declare function omniMatch<T>(value: unknown, pattern: T): MatchResult<T> | void;
