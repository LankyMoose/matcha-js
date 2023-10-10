import { omniMatch, type, optional, nullable, Value, _ } from "./value.js";
export { match, type, optional, nullable, Value, _, is };
/**
 * @throws {Error} if no match is found
 */
function match(value) {
    return ((...items) => {
        for (const [pattern, res] of items) {
            const match = omniMatch(value, pattern);
            if (match)
                return (typeof res === "function" && res(match.value)) || res;
        }
        throw new Error("No match found");
    });
}
function is(val, func) {
    return [val, func];
}
