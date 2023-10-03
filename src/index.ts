import { match } from "./match.js"

match("asd")
  .with([
    [[], () => console.log("empty array")],
    [[1, 2, 3], () => console.log("array with values")],
    [123, () => console.log("number")],
    [{}, () => console.log("empty object")],
    ["", () => console.log("empty string")],
    [String, () => console.log("string type")],
    [Number, () => console.log("number type")],
  ])
  .or(() => console.log("no match"))
  .catch((e) => console.log(e))
