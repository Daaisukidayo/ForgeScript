import { CompiledFunction } from "../structures/@internal/CompiledFunction";
import { FunctionRegistry } from "./FunctionRegistry";
import { ICompilationResult, IRawFunction } from "./types";
export interface IExtendedCompilationResult extends Omit<ICompilationResult, "functions"> {
    functions: CompiledFunction[];
}
export declare const Syntax: {
    readonly Open: "[";
    readonly Close: "]";
    readonly Escape: "\\";
    readonly Count: "@";
    readonly Negation: "!";
    readonly Separator: ";";
    readonly Silent: "#";
};
/**
 * Compiles ForgeScript source into an executable representation.
 *
 * Unlike the original implementation, this is a plain instantiable class:
 * no static mutable registry/regex, no `this.code!` non-null assertions
 * scattered around, and the actual work is delegated to small focused
 * collaborators (Cursor, FieldParser, TemplateCompiler) so each can be
 * tested and reasoned about on its own.
 */
export declare class Compiler {
    private readonly path;
    private readonly code;
    private readonly registry;
    /**
     * Default, process-wide registry. Kept so that every existing call site
     * (`Compiler.compile(code, path)`) keeps working unchanged — same as
     * the original `Compiler.Functions` static Collection, just now backed
     * by the instantiable `FunctionRegistry` instead of ad-hoc static state
     * on the compiler itself. Pass an explicit registry (3rd overload arg)
     * to bypass this — e.g. in tests, or to run an isolated set of functions.
     *
     * Public (unlike the original private `Compiler.Functions`/`Compiler.Regex`)
     * so tooling/debug scripts can inspect it — e.g. `Compiler.defaultRegistry.regex`
     * instead of reaching into a private field via bracket-notation.
     */
    static readonly defaultRegistry: FunctionRegistry;
    private readonly cursor;
    private readonly template;
    private readonly fieldParser;
    private readonly matches;
    private matchIndex;
    private nextId;
    private outputFunctions;
    private outputCode;
    private constructor();
    /** Registers/updates functions on the default, process-wide registry. */
    static setFunctions(fns: IRawFunction[]): void;
    static compile(code?: string, path?: string | null, registry?: FunctionRegistry): IExtendedCompilationResult;
    private compile;
    /** Copies raw text (handling escapes) up to `targetIndex` into the output. */
    private consumeTextUntil;
    private parseFunction;
    private prepareFunction;
    private currentMatch;
    private dropMatchIfAt;
    private findMatches;
    private resolveFunction;
    private error;
}
//# sourceMappingURL=Compiler.d.ts.map