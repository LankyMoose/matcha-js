import { omniMatch } from "./value.js";
export * from "./value.js";
export { match };
function matchSuccess(item, value) {
    return typeof item[1] === "function" ? item[1](value) : item[1];
}
function match(value) {
    return (...items) => {
        for (const item of items) {
            if (omniMatch(value, item[0]))
                return matchSuccess(item, value);
        }
        throw new Error("No match found");
    };
}
