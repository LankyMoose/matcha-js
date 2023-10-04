export * from "./value.js";
export { match };
type Pattern = [any, () => any];
declare function match<T>(value: T): <P extends Pattern[]>(...patterns: P) => ReturnType<P[number][1]>;
