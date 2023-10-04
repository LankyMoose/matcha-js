type Constructor<T> = new (...args: any[]) => T;
type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor | ArrayConstructor | ObjectConstructor | ErrorConstructor | PromiseConstructor | DateConstructor;
