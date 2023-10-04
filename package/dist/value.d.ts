export { type, optional, nullable, Value, _ };
type ClassRef<T> = PrimitiveConstructor | Constructor<T>;
declare class Value {
    static match<T>(lhs: any, val: T): boolean;
}
declare class AnyValue {
    private readonly __isAny;
    static isAnyValue(val: any): val is AnyValue;
}
declare const _: AnyValue;
declare class TypedValue<T> {
    private readonly __isOfType;
    classRefs: Array<ClassRef<T>>;
    constructor(...classRefs: Array<ClassRef<T>>);
    static isTypedValue(val: any): val is TypedValue<any>;
    match(val: any): boolean;
}
declare class OptionalValue<T = void> {
    private readonly __isOptional;
    classRefs: Array<ClassRef<T>>;
    constructor(...classRefs: Array<ClassRef<T>>);
    static isOptionalValue(val: any): val is OptionalValue<any>;
    match(val: any): boolean;
}
declare class NullableValue<T = void> {
    private readonly __isNullable;
    classRefs: Array<ClassRef<T>>;
    constructor(...classRefs: Array<ClassRef<T>>);
    static isNullableValue(val: any): val is NullableValue<any>;
    match(val: any): boolean;
}
declare function optional<T>(...classRefs: ClassRef<T>[]): OptionalValue<T>;
declare function type<T>(...classRefs: ClassRef<T>[]): TypedValue<T>;
declare function nullable<T>(...classRefs: ClassRef<T>[]): NullableValue<T>;
