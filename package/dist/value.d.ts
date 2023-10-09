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
declare class TypedValue extends Value {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<unknown>[]);
    get [Symbol.toStringTag](): string;
    static isTypedValue(val: any): val is TypedValue;
    match(val: any): boolean;
}
declare class OptionalValue extends Value {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<unknown>[]);
    get [Symbol.toStringTag](): string;
    static isOptionalValue(val: any): val is OptionalValue;
    match(val: any): boolean;
}
declare class NullableValue extends Value {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<unknown>[]);
    get [Symbol.toStringTag](): string;
    static isNullableValue(val: any): val is NullableValue;
    match(val: any): boolean;
}
declare function optional(...classRefs: ClassRef<unknown>[]): OptionalValue;
declare function type(...classRefs: ClassRef<unknown>[]): TypedValue;
declare function nullable(...classRefs: ClassRef<unknown>[]): NullableValue;
declare function omniMatch(value: unknown, pattern: unknown): boolean;
