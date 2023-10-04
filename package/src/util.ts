export { isConstructor, isObject }

function isConstructor(value: any): value is new (...args: any[]) => any {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor === value
  )
}

function isObject(value: any): value is Object {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Promise)
  )
}
