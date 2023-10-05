import { ClassRef, PrimitiveConstructor, Obj } from "./types.js"

export {
  type,
  optional,
  nullable,
  Value,
  _,
  isObject,
  isConstructor,
  deepObjectEq,
  deepArrayEq,
}

class Value {
  // @ts-expect-error
  private isSpread: boolean = false

  static match<T>(lhs: any, val: T) {
    if (typeof lhs !== "object") return false

    if (AnyValue.isAnyValue(lhs)) return true
    if (TypedValue.isTypedValue(lhs)) return lhs.match(val)
    if (OptionalValue.isOptionalValue(lhs)) return lhs.match(val)
    if (NullableValue.isNullableValue(lhs)) return lhs.match(val)

    return false
  }

  [Symbol.iterator](): Iterator<Value> {
    let i = 0
    return {
      next: () => {
        if (i === 0) {
          i++
          this.isSpread = true
          return { value: this, done: false }
        }
        return { value: undefined, done: true }
      },
    }
  }
}

class AnyValue extends Value {
  get [Symbol.toStringTag]() {
    return "MatchaAny"
  }
  static isAnyValue(val: any): val is AnyValue {
    return val.toString() === "[object MatchaAny]"
  }
}

const _ = new AnyValue()

class TypedValue<T> extends Value {
  private readonly classRefs: ClassRef<T>[]
  constructor(...classRefs: ClassRef<T>[]) {
    super()
    this.classRefs = classRefs
  }
  get [Symbol.toStringTag]() {
    return "MatchaTyped"
  }
  static isTypedValue(val: any): val is TypedValue<any> {
    return val.toString() === "[object MatchaTyped]"
  }

  match(val: any) {
    return matchTypes(val, this.classRefs)
  }
}

class OptionalValue<T> extends Value {
  private readonly classRefs: ClassRef<T>[]
  constructor(...classRefs: ClassRef<T>[]) {
    super()
    this.classRefs = classRefs
  }
  get [Symbol.toStringTag]() {
    return "MatchaOptional"
  }
  static isOptionalValue(val: any): val is OptionalValue<any> {
    return val.toString() === "[object MatchaOptional]"
  }
  match(val: any) {
    if (val === undefined) return true
    if (val === null) return false // null is not optional
    return matchTypes(val, this.classRefs)
  }
}

class NullableValue<T = void> extends Value {
  private readonly classRefs: ClassRef<T>[]
  constructor(...classRefs: ClassRef<T>[]) {
    super()
    this.classRefs = classRefs
  }
  get [Symbol.toStringTag]() {
    return "MatchaNullable"
  }
  static isNullableValue(val: any): val is NullableValue<any> {
    return val.toString() === "[object MatchaNullable]"
  }
  match(val: any) {
    if (val === null) return true
    if (val === undefined) return false // undefined is not nullable
    return matchTypes(val, this.classRefs)
  }
}

function optional<T>(...classRefs: ClassRef<T>[]) {
  return new OptionalValue(...classRefs)
}

function type<T>(...classRefs: ClassRef<T>[]) {
  return new TypedValue(...classRefs)
}

function nullable<T>(...classRefs: ClassRef<T>[]) {
  return new NullableValue(...classRefs)
}

function matchTypes<T>(val: any, classRefs: ClassRef<T>[]) {
  return classRefs.some((classRef) => matchType(val, classRef))
}

function matchType<T>(val: any, classRef: ClassRef<T> | PrimitiveConstructor) {
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

function isConstructor(value: any): value is new (...args: any[]) => any {
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

function deepObjectEq(pattern: Obj, value: Obj) {
  let optionalCount = 0

  const pKeys = Object.keys(pattern).sort()
  const vKeys = Object.keys(value).sort()

  for (let i = 0; i < pKeys.length; i++) {
    const pVal = pattern[pKeys[i]]
    const vVal = value[vKeys[i]]

    if (vKeys[i] === undefined) {
      if (OptionalValue.isOptionalValue(pVal)) {
        optionalCount++
      } else {
        return false
      }
    }

    if (Value.match(pVal, vVal)) continue

    if (isObject(pVal) && isObject(vVal) && deepObjectEq(pVal, vVal)) {
      continue
    }

    if (Array.isArray(pVal) && Array.isArray(vVal) && deepArrayEq(pVal, vVal)) {
      continue
    }

    if (pVal !== vVal) return false
  }

  if (pKeys.length - optionalCount !== vKeys.length) {
    return false
  }

  return true
}

function deepArrayEq(pattern: Array<unknown>, value: Array<unknown>) {
  let optionalCount = 0

  for (let i = 0; i < pattern.length; i++) {
    const pItem = pattern[i]
    const vItem = value[i]

    if (Value.match(pItem, vItem)) {
      if (OptionalValue.isOptionalValue(pItem)) {
        optionalCount++
      }
      continue
    }

    if (isObject(pItem) && isObject(vItem) && deepObjectEq(pItem, vItem)) {
      continue
    }

    if (Array.isArray(pItem) && Array.isArray(vItem) && deepArrayEq(pItem, vItem)) {
      continue
    }

    if (pItem !== vItem) return false
  }

  if (pattern.length - optionalCount !== value.length) {
    return false
  }

  return true
}
