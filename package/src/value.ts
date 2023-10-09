import { ClassRef, Constructor, Obj } from "./types.js"

export { type, optional, nullable, Value, _, omniMatch }

class Value {
  #_isSpread: boolean = false
  get isSpread(): boolean {
    return this.#_isSpread
  }

  static isValue(val: any): val is Value {
    if (typeof val !== "object") return false
    return (
      AnyValue.isAnyValue(val) ||
      TypedValue.isTypedValue(val) ||
      OptionalValue.isOptionalValue(val) ||
      NullableValue.isNullableValue(val)
    )
  }

  static match<T>(value: Value, val: T) {
    if (AnyValue.isAnyValue(value)) return true
    if (TypedValue.isTypedValue(value)) return value.match(val)
    if (OptionalValue.isOptionalValue(value)) return value.match(val)
    if (NullableValue.isNullableValue(value)) return value.match(val)

    return false
  }

  [Symbol.iterator](): Iterator<Value> {
    let i = 0
    return {
      next: () => {
        if (i === 0) {
          i++
          this.#_isSpread = true
          return { value: this, done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }
}

const anySymbol = Symbol("matcha_any")

class AnyValue extends Value {
  // @ts-expect-error
  private readonly [anySymbol] = true

  get [Symbol.toStringTag]() {
    return "MatchaAny"
  }
  static isAnyValue(val: any): val is AnyValue {
    return val.toString() === "[object MatchaAny]"
  }
  static isPartialObject(val: Obj): boolean {
    // check if the object has the anySymbol property
    return anySymbol in val
  }
}

const _ = new AnyValue()

class TypedValue extends Value {
  private readonly classRefs: ClassRef<unknown>[]
  constructor(...classRefs: ClassRef<unknown>[]) {
    super()
    this.classRefs = classRefs
  }
  get [Symbol.toStringTag]() {
    return "MatchaTyped"
  }
  static isTypedValue(val: any): val is TypedValue {
    return val.toString() === "[object MatchaTyped]"
  }

  match(val: any) {
    return matchTypes(val, this.classRefs)
  }
}

class OptionalValue extends Value {
  private readonly classRefs: ClassRef<unknown>[]
  constructor(...classRefs: ClassRef<unknown>[]) {
    super()
    this.classRefs = classRefs
  }
  get [Symbol.toStringTag]() {
    return "MatchaOptional"
  }
  static isOptionalValue(val: any): val is OptionalValue {
    return val.toString() === "[object MatchaOptional]"
  }
  match(val: any) {
    if (val === undefined) return true
    if (val === null) return false // null is not optional
    return matchTypes(val, this.classRefs)
  }
}

class NullableValue extends Value {
  private readonly classRefs: ClassRef<unknown>[]
  constructor(...classRefs: ClassRef<unknown>[]) {
    super()
    this.classRefs = classRefs
  }
  get [Symbol.toStringTag]() {
    return "MatchaNullable"
  }
  static isNullableValue(val: any): val is NullableValue {
    return val.toString() === "[object MatchaNullable]"
  }
  match(val: any) {
    if (val === null) return true
    if (val === undefined) return false // undefined is not nullable
    return matchTypes(val, this.classRefs)
  }
}

function optional(...classRefs: ClassRef<unknown>[]) {
  return new OptionalValue(...classRefs)
}

function type(...classRefs: ClassRef<unknown>[]) {
  return new TypedValue(...classRefs)
}

function nullable(...classRefs: ClassRef<unknown>[]) {
  return new NullableValue(...classRefs)
}

function matchTypes(val: any, classRefs: ClassRef<unknown>[]) {
  return classRefs.some((classRef) => matchType(val, classRef))
}

function matchType(val: any, classRef: ClassRef<unknown>) {
  switch (classRef) {
    case String:
      return typeof val === "string"
    case Number:
      return typeof val === "number"
    case Boolean:
      return typeof val === "boolean"
    case BigInt:
      return typeof val === "bigint"
    case Symbol:
      return typeof val === "symbol"
    case Array:
      return Array.isArray(val)
    case Object:
      return isObject(val)
    case Error:
      return val instanceof Error
    case Promise:
      return val instanceof Promise
    case Date:
      return val instanceof Date
    default:
      return val instanceof classRef
  }
}

function isConstructor(value: any): value is Constructor<unknown> {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor === value
  )
}

function isObject(value: any): value is Obj {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Promise)
  )
}

function deepObjectEq(value: Obj, pattern: Obj) {
  const isPartial = AnyValue.isPartialObject(pattern)

  const pKeys = Object.keys(pattern).sort()
  const vKeys = Object.keys(value).sort()

  if (isPartial) {
    for (let i = 0; i < pKeys.length; i++) {
      const pKey = pKeys[i]

      const pVal = pattern[pKey]
      const vVal = value[pKey]

      if (pVal === undefined) {
        if (isPartial) continue
        return false
      }

      if (pVal === null) {
        if (vVal !== null) return false
        continue
      }

      if (Value.isValue(pVal)) {
        if (!Value.match(pVal, vVal)) return false
        continue
      }

      if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(vVal, pVal)) {
        continue
      }

      if (isObject(pVal) && isObject(vVal) && deepObjectEq(vVal, pVal)) {
        continue
      }

      if (pVal !== vVal) return false
    }
  } else {
    for (let i = 0; i < vKeys.length; i++) {
      const vKey = vKeys[i]

      const pVal = pattern[vKey]
      const vVal = value[vKey]

      if (pVal === undefined) {
        if (isPartial) continue
        return false
      }

      if (pVal === null) {
        if (vVal !== null) return false
        continue
      }

      if (Value.isValue(pVal)) {
        if (!Value.match(pVal, vVal)) return false
        continue
      }

      if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(vVal, pVal)) {
        continue
      }

      if (isObject(pVal) && isObject(vVal) && deepObjectEq(vVal, pVal)) {
        continue
      }

      if (pVal !== vVal) return false
    }

    const pOnlyKeys = pKeys.filter((key) => !vKeys.includes(key))

    if (pOnlyKeys.length > 0) {
      for (let i = 0; i < pOnlyKeys.length; i++) {
        const pVal = pattern[pOnlyKeys[i]]

        if (pVal === undefined || pVal === null) return false

        if (OptionalValue.isOptionalValue(pVal)) continue

        return false
      }
    }
  }

  return true
}

function deepArrayEq(value: Array<unknown>, pattern: Array<unknown>) {
  let pi = 0
  let vi = 0

  while (pi < pattern.length || vi < value.length) {
    const pItem = pattern[pi]
    const vItem = value[vi]

    if (Value.isValue(pItem)) {
      const nextPatternItem = pattern[pi + 1]
      if (Value.match(pItem, vItem)) {
        if (pItem.isSpread) {
          vi++

          // if the next pattern item is not a spread and would match with this value item
          // then we need to end this spread
          //eg:
          // val = ["start", "started", "going", "ending", "ended"]
          // pattern = ["start", ...type(String), "going", ...type(String)]

          if (Value.isValue(nextPatternItem) && nextPatternItem.isSpread) {
          } else {
            if (omniMatch(vItem, nextPatternItem)) {
              pi++
              vi--
            }
          }

          continue
        }
        pi++
        vi++
        continue
      }

      if (!omniMatch(vItem, nextPatternItem)) {
        return false
      }

      pi++
      if (pi > value.length) return false
      if (pi > pattern.length) return false
      continue
    }

    if (isObject(pItem) && isObject(vItem)) {
      if (!deepObjectEq(vItem, pItem)) return false
      pi++
      vi++
      continue
    }

    if (Array.isArray(pItem) && Array.isArray(vItem)) {
      if (!deepArrayEq(vItem, pItem)) return false
      pi++
      vi++
      continue
    }

    if (pItem === vItem) {
      pi++
      vi++
      continue
    } else {
      if (!pItem) return false
      // handle cases where:
      // value = ["start", "middle", "end", "the very end"]
      // pattern = [...type(String), "end", "the very end"]
      // or:
      // value = ["start", "middle", "end", "the very end", "just kidding"]
      // pattern = ["start", ...type(String), "end", "the very end"]

      const pItemDistToEnd = pattern.length - pi
      let vIdx = value.length - pItemDistToEnd

      const vItem = value[vIdx]

      if (vItem === pItem) {
        pi++
        vi++
        continue
      }

      if (primitiveMatch(vItem, pItem)) {
        pi++
        vi++
        continue
      }

      if (Array.isArray(pItem) && Array.isArray(vItem)) {
        if (!deepArrayEq(vItem, pItem)) return false
        pi++
        vi++
        continue
      }

      if (Value.isValue(pItem) && Value.match(pItem, vItem)) {
        pi++
        vi++
        continue
      }

      if (isObject(pItem) && isObject(vItem)) {
        if (!deepObjectEq(vItem, pItem)) return false
        pi++
        vi++
        continue
      }

      return false
    }
  }

  return true
}

function primitiveMatch(value: unknown, pattern: unknown) {
  switch (typeof value) {
    case "string":
      if (
        pattern === String ||
        (typeof pattern === "string" && pattern === value) ||
        (pattern instanceof RegExp && pattern.test(value))
      )
        return true
      break
    case "number":
      if (pattern === Number || (typeof pattern === "number" && pattern === value))
        return true
      break
    case "boolean":
      if (pattern === Boolean || (typeof pattern === "boolean" && pattern === value))
        return true
      break
    case "bigint":
      if (pattern === BigInt || (typeof pattern === "bigint" && pattern === value))
        return true
      break
    case "symbol":
      if (pattern === Symbol || (typeof pattern === "symbol" && pattern === value))
        return true
      break
    case "function":
      if (pattern === Function || (typeof pattern === "function" && pattern === value))
        return true
      break
    default:
      break
  }
  return false
}

function arrayMatch(value: unknown, pattern: unknown) {
  if (!Array.isArray(value)) return false

  if (pattern === Array) return true

  return Array.isArray(pattern) && deepArrayEq(value, pattern)
}

function objectMatch(value: unknown, pattern: unknown) {
  if (!isObject(value)) return false

  if (pattern === Object) return true

  if (isConstructor(pattern) && value instanceof pattern) return true

  return isObject(pattern) && deepObjectEq(value, pattern)
}

function omniMatch(value: unknown, pattern: unknown) {
  return (
    value === pattern ||
    primitiveMatch(value, pattern) ||
    arrayMatch(value, pattern) ||
    (Value.isValue(pattern) && Value.match(pattern, value)) ||
    objectMatch(value, pattern)
  )
}
