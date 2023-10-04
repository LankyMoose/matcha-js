import { isObject } from "./util.js"

export { type, optional, nullable, Value, _ }

class Value {
  static match<T>(lhs: any, val: T) {
    if (AnyValue.isAnyValue(lhs)) return true
    if (TypedValue.isTypedValue(lhs) && lhs.match(val)) return true
    if (OptionalValue.isOptionalValue(lhs) && lhs.match(val)) return true
    if (NullableValue.isNullableValue(lhs) && lhs.match(val)) return true

    return false
  }
}

class AnyValue {
  // @ts-expect-error
  private readonly __isAny = true
  static isAnyValue(val: any): val is AnyValue {
    return typeof val === "object" && "__isAny" in val
  }
}

const _ = new AnyValue()

class TypedValue<T> {
  // @ts-expect-error
  private readonly __isOfType = true
  constructor(private classRef: PrimitiveConstructor | Constructor<T>) {}
  static isTypedValue(val: any): val is TypedValue<any> {
    return typeof val === "object" && "__isOfType" in val
  }

  match(val: any) {
    return matchType(this.classRef, val)
  }
}

class OptionalValue<T = void> {
  // @ts-expect-error
  private readonly __isOptional = true
  constructor(private classRef: PrimitiveConstructor | Constructor<T>) {}
  static isOptionalValue(val: any): val is OptionalValue<any> {
    return typeof val === "object" && "__isOptional" in val
  }
  match(val: any) {
    if (val === undefined) return true
    if (val === null) return false // null is not optional
    return matchType(this.classRef, val)
  }
}

class NullableValue<T = void> {
  // @ts-expect-error
  private readonly __isNullable = true
  constructor(private classRef: PrimitiveConstructor | Constructor<T>) {}
  static isNullableValue(val: any): val is NullableValue<any> {
    return typeof val === "object" && "__isNullable" in val
  }
  match(val: any) {
    if (val === null) return true
    if (val === undefined) return false // undefined is not nullable
    return matchType(this.classRef, val)
  }
}

function optional<T>(classRef: PrimitiveConstructor | Constructor<T>) {
  return new OptionalValue(classRef)
}

function type<T>(classRef: PrimitiveConstructor | Constructor<T>) {
  return new TypedValue(classRef)
}

function nullable<T>(classRef: PrimitiveConstructor | Constructor<T>) {
  return new NullableValue(classRef)
}

function matchType<T>(
  targetClass: PrimitiveConstructor | Constructor<T>,
  val: any
) {
  switch (targetClass) {
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
      return val instanceof targetClass
  }
}
