import { AnyValue, DefaultValue } from "./value.js"

export { isConstructor, isObject, deepObjectEq, deepArrayEq }

function isConstructor(value: any): value is new (...args: any[]) => any {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor === value
  )
}

type Obj = Record<string | symbol | number, unknown>

function isObject(value: any): value is Obj {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Promise)
  )
}

function deepObjectEq(objA: Obj, objB: Obj) {
  const aKeys = Object.keys(objA).sort()
  const bKeys = Object.keys(objB).sort()

  if (aKeys.length !== bKeys.length) {
    return false
  }

  for (let i = 0; i < aKeys.length; i++) {
    if (aKeys[i] !== bKeys[i]) return false

    const a = objA[aKeys[i]]
    const b = objB[bKeys[i]]

    if (AnyValue.isAnyValue(a) && a.match(b)) continue
    if (DefaultValue.isDefaultValue(a)) continue
    if (isObject(a) && isObject(b) && deepObjectEq(a, b)) continue
    if (Array.isArray(a) && Array.isArray(b) && deepArrayEq(a, b)) continue
    if (a !== b) return false
  }
  return true
}

function deepArrayEq(arrA: Array<unknown>, arrB: Array<unknown>) {
  if (arrA.length !== arrB.length) {
    return false
  }

  for (let i = 0; i < arrA.length; i++) {
    const a = arrA[i]
    const b = arrB[i]

    if (AnyValue.isAnyValue(a) && a.match(b)) continue
    if (DefaultValue.isDefaultValue(a)) continue
    if (isObject(a) && isObject(b) && deepObjectEq(a, b)) continue
    if (Array.isArray(a) && Array.isArray(b) && deepArrayEq(a, b)) continue
    if (a !== b) return false
  }
  return true
}
