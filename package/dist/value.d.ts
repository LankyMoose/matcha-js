export { pattern, any, AnyValue };
type ConstructorType<T> = new (...args: any[]) => T;
declare class AnyValue<T> {
    match: {
        (val: any): val is T;
    };
    __isAny: boolean;
    constructor(match: {
        (val: any): val is T;
    });
    static isAnyValue(val: any): val is AnyValue<any>;
}
declare function pattern(regex: RegExp): AnyValue<string>;
type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor | ArrayConstructor | ObjectConstructor | ErrorConstructor | PromiseConstructor | DateConstructor;
declare function any<T>(classRef: PrimitiveConstructor | ConstructorType<T>): AnyValue<number> | AnyValue<bigint> | AnyValue<Object> | AnyValue<Date> | AnyValue<T>;
