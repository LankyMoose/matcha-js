import type { Fn, LHS, Resolved } from "./types.js"
import { omniMatch, type, optional, nullable, Value, _ } from "./value.js"

export { match, type, optional, nullable, Value, _, is }

/**
 * @throws {Error} if no match is found
 */
function match(value: any) {
  return ((...items: [any, Fn<any, any>][]) => {
    for (const [pattern, res] of items) {
      const match = omniMatch(value, pattern)
      if (match) return (typeof res === "function" && res(match.value)) || res
    }

    throw new Error("No match found")
  }) as <U extends [any, Fn<any, any>][]>(...items: U) => ReturnType<U[number][1]>
}

function is<T, U>(val: T, func: (val: Resolved<T>) => U) {
  return [val, func] as [LHS<T>, (val: Resolved<T>) => U]
}
