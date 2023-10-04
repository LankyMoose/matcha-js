import { ClassRef } from "./types.js";
export { type, optional, nullable, Value, _ };
declare class Value {
    static match<T>(lhs: any, val: T): boolean;
}
declare class AnyValue {
    private readonly __isAny;
    static isAnyValue(val: any): val is AnyValue;
}
declare const _: AnyValue;
declare class TypedValue<T> {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<T>[]);
    private readonly __isOfType;
    static isTypedValue(val: any): val is TypedValue<any>;
    match(val: any): boolean;
}
declare class OptionalValue<T> {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<T>[]);
    private readonly __isOptional;
    static isOptionalValue(val: any): val is OptionalValue<any>;
    match(val: any): boolean;
}
declare class NullableValue<T = void> {
    private readonly classRefs;
    constructor(...classRefs: ClassRef<T>[]);
    private readonly __isNullable;
    static isNullableValue(val: any): val is NullableValue<any>;
    match(val: any): boolean;
}
declare function optional<T>(...classRefs: ClassRef<T>[]): OptionalValue<T>;
declare function type<T>(...classRefs: ClassRef<T>[]): TypedValue<T>;
declare function nullable<T>(...classRefs: ClassRef<T>[]): NullableValue<T>;
