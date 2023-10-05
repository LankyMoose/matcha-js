import type { MatchItem } from "./types.js";
export * from "./value.js";
export { match };
declare function match<T>(value: T): <MI extends MatchItem<T>[]>(...items: MI) => MI[number][1] extends Function ? ReturnType<MI[number][1]> : MI[number][1];
