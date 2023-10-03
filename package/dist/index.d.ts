type Pattern = [any, () => any];
declare class PatternMatcher {
    matched: boolean;
    error: null;
    constructor(value: any, patterns: Pattern[]);
    or(fallback: () => any): this;
    catch(fallback: (e: Error) => any): this;
}
export declare function match(x: any): {
    with: (...patterns: Pattern[]) => PatternMatcher;
};
export {};
