import { IRawFunction } from "./types";
/**
 * Holds registered functions and builds the matching regex for a *single*
 * compiler instance. Unlike the original `Compiler.Functions` /
 * `Compiler.Regex` static fields, this is not shared global state — you can
 * have multiple independent registries (e.g. per-bot, per-test) in the same
 * process without them interfering with each other.
 */
export declare class FunctionRegistry {
    private readonly byName;
    private cachedRegex;
    register(fns: IRawFunction[]): this;
    resolve(name: string): IRawFunction | undefined;
    get regex(): RegExp;
    private buildRegex;
}
//# sourceMappingURL=FunctionRegistry.d.ts.map