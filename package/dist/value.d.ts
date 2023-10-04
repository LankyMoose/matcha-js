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
    private classRef;
    private readonly __isOfType;
    constructor(classRef: PrimitiveConstructor | Constructor<T>);
    static isTypedValue(val: any): val is TypedValue<any>;
    match(val: any): boolean;
}
declare class OptionalValue<T = void> {
    private classRef;
    private readonly __isOptional;
    constructor(classRef: PrimitiveConstructor | Constructor<T>);
    static isOptionalValue(val: any): val is OptionalValue<any>;
    match(val: any): boolean;
}
declare class NullableValue<T = void> {
    private classRef;
    private readonly __isNullable;
    constructor(classRef: PrimitiveConstructor | Constructor<T>);
    static isNullableValue(val: any): val is NullableValue<any>;
    match(val: any): boolean;
}
declare function optional<T>(classRef: PrimitiveConstructor | Constructor<T>): OptionalValue<T>;
declare function type<T>(classRef: PrimitiveConstructor | Constructor<T>): TypedValue<T>;
declare function nullable<T>(classRef: PrimitiveConstructor | Constructor<T>): NullableValue<T>;
