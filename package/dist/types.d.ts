import { AnyValue, TypedValue, NullableValue, OptionalValue } from "./value";
export type Fn<in In, out Out> = (inp: In) => Out;
export type Constructor<T> = abstract new (...args: any[]) => T;
export type LHS<T> = T extends Constructor<infer U> ? U : T;
export type ClassRef<T> = PrimitiveConstructor | Constructor<T>;
export type PrimitiveConstructor = StringConstructor | NumberConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor | ArrayConstructor | ObjectConstructor | ErrorConstructor | PromiseConstructor | DateConstructor;
export type Obj = Record<string | symbol | number, unknown>;
export type TypeOf<T> = {} & {
    [key in keyof T]: Resolved<T[key]>;
};
export type EvaluatedArray<T> = T extends ReadonlyArray<infer U> ? Resolved<U>[] : never;
export type ResolvedError<T> = T extends EvalErrorConstructor | EvalError ? EvalError : T extends RangeErrorConstructor | RangeError ? RangeError : T extends ReferenceErrorConstructor | ReferenceError ? ReferenceError : T extends SyntaxErrorConstructor | SyntaxError ? SyntaxError : T extends TypeErrorConstructor | TypeError ? TypeError : T extends URIErrorConstructor | URIError ? URIError : never;
export type Resolved<T> = T extends RegExp ? RegExpExecArray : T extends RegExpConstructor ? RegExp : T extends String | StringConstructor ? string : T extends Number | NumberConstructor ? number : T extends BigInt | BigIntConstructor ? bigint : T extends Boolean | BooleanConstructor ? boolean : T extends Symbol | SymbolConstructor ? symbol : T extends ReadonlyArray<unknown> ? EvaluatedArray<T> : T extends ArrayConstructor ? Array<unknown> : T extends Error ? ResolvedError<T> : T extends Promise<infer U> | PromiseConstructor ? Promise<Resolved<U>> : T extends Date | DateConstructor ? Date : T extends undefined ? undefined : T extends null ? null : T extends AnyValue ? unknown : T extends TypedValue<infer U> ? Resolved<U> : T extends NullableValue<infer U> ? Resolved<U> | null : T extends OptionalValue<infer U> ? Resolved<U> | undefined : T extends Constructor<any> ? InstanceType<T> : T extends Function | FunctionConstructor ? T : T extends Obj ? TypeOf<T> : T extends Object | ObjectConstructor ? Obj : T;
export type MatchResult<T> = {
    value: Resolved<T>;
};
