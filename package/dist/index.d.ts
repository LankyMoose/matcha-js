import type { Fn, LHS, Resolved } from "./types.js";
import { type, optional, nullable, Value, _ } from "./value.js";
export { match, type, optional, nullable, Value, _, is };
/**
 * @throws {Error} if no match is found
 */
declare function match(value: any): <U extends [any, Fn<any, any>][]>(...items: U) => ReturnType<U[number][1]>;
declare function is<T, U>(val: T, func: (val: Resolved<T>) => U): [LHS<T>, (val: Resolved<T>) => U];
