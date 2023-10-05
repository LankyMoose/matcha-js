import { match, type, _ } from "matcha-js"

// match(["start", "middle", "end"])(
//   [[...type(String), "end"], () => console.log("matched")],
//   [_, () => console.log("no match")]
// )

// match(["start", "started", "going", "ending", "ended"])(
//   [
//     ["start", ...type(String), "gosing", ...type(String), "ended"],
//     () => console.log("matched"),
//   ],
//   [_, () => console.log("no match")]
// )

match([1, 2, 3, 4, 5, "Test", {}, []])(
  [
    [...type(Number), type(String), ..._],
    () => console.log("value is [...(a number), (a string), ..._]"),
  ],
  [_, () => console.log("no match")]
)

// match([{}, { asd: [] }])(
//   [[...type(Object), { asd: [] }], () => console.log("matched")],
//   [_, () => console.log("no match")]
// )
