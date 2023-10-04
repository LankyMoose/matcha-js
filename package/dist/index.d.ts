export * from "./value.js";
export { match };
type Pattern<T> = [any, ((val: T) => any) | any];
declare function match<T>(value: T): <P extends Pattern<T>[]>(...patterns: P) => P[number][1] extends Function ? ReturnType<P[number][1]> : P[number][1];
