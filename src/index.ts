import { match } from "./match.js"

match({ a: { b: 123 } })
  .with([
    [{}, () => console.log("empty object")],
    [{ a: 123 }, () => console.log("object with a:123")],
    [{ a: { b: 123 } }, () => console.log("object with a: { b: 123 }")],
    [Object, () => console.log("object type")],
    [[], () => console.log("empty array")],
    [[1, 2, 3], () => console.log("array with values 1,2,3")],
    [123, () => console.log("number")],
    ["", () => console.log("empty string")],
    [String, () => console.log("string type")],
    [Number, () => console.log("number type")],
    [Error, () => console.log("error type")],
  ])
  .or(() => console.log("no match"))
  .catch((e) => console.log(e))
