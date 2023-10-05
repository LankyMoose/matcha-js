export type Constructor<T> = new (...args: any[]) => T;
export type ClassRef<T> = PrimitiveConstructor | Constructor<T>;
export type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor | ArrayConstructor | ObjectConstructor | ErrorConstructor | PromiseConstructor | DateConstructor;
export type Obj = Record<string | symbol | number, unknown>;
