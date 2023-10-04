import { isObject, isConstructor } from "./util.js"
import { AnyValue, DefaultValue } from "./value.js"

export * from "./value.js"

export { match }

type Pattern = [any, () => any]

function match<T>(value: T) {
  return <P extends Pattern[]>(...patterns: P): ReturnType<P[number][1]> => {
    for (const pattern of patterns) {
      const [lhs] = pattern
      switch (typeof value) {
        case "string":
          if (lhs === String || (typeof lhs === "string" && lhs === value)) return pattern[1]()
          break
        case "number":
          if (lhs === Number || (typeof lhs === "number" && lhs === value)) return pattern[1]()
          break
        case "boolean":
          if (lhs === Boolean || (typeof lhs === "boolean" && lhs === value)) return pattern[1]()
          break
        case "bigint":
          if (lhs === BigInt || (typeof lhs === "bigint" && lhs === value)) return pattern[1]()
          break
        case "symbol":
          if (lhs === Symbol || (typeof lhs === "symbol" && lhs === value)) return pattern[1]()
          break
        case "function":
          if (lhs === Function || (typeof lhs === "function" && lhs === value)) return pattern[1]()
          break
        default:
          break
      }

      if (AnyValue.isAnyValue(lhs)) {
        if (lhs.match(value)) return pattern[1]()
      } else if (DefaultValue.isDefaultValue(lhs)) {
        return pattern[1]()
      }

      for (const classRef of [Error, Promise, Date]) {
        if (value instanceof classRef) {
          if (lhs === classRef || lhs === value.constructor) return pattern[1]()
        }
      }

      if (value === null || value === undefined) {
        if (lhs === value) return pattern[1]()
      }

      if (Array.isArray(value)) {
        if (lhs === Array) {
          return pattern[1]()
        } else if (Array.isArray(lhs)) {
          if (
            lhs.length === value.length &&
            lhs.every((p, i) => p === value[i] || (p instanceof AnyValue && p.match(value[i])))
          ) {
            return pattern[1]()
          }
        } else {
          continue
        }
      }

      if (isObject(value)) {
        if (isConstructor(lhs)) {
          if (value instanceof lhs) return pattern[1]()
        }
        if (lhs === Object) {
          return pattern[1]()
        } else if (isObject(lhs)) {
          const aKeys = Object.keys(value)
          const bKeys = Object.keys(lhs)
          if (
            aKeys.length === bKeys.length &&
            aKeys.every(
              (p) =>
                lhs[p] === value[p as keyof typeof value] ||
                (lhs[p] instanceof AnyValue && lhs[p].match(value[p as keyof typeof value]))
            )
          ) {
            return pattern[1]()
          }
        } else {
          continue
        }
      }
    }
    throw new Error("No match found")
  }
}
