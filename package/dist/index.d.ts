export * from "./value.js";
export { match, PatternMatcher };
type Pattern = [any, () => any];
declare class PatternMatcher {
    private matched;
    constructor(value: any, patterns: Pattern[]);
    orElse(fallback: () => any): this;
}
declare function match(x: any): {
    with: (...patterns: Pattern[]) => PatternMatcher;
};
