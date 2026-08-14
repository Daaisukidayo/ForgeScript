import { Cursor } from "./Cursor";
import { TemplateCompiler } from "./TemplateCompiler";
import { ICompiledField, ICompiledFunction, IRawField, IRawFunctionMatch } from "./types";
/**
 * Parses one field (normal or condition) of a function call. Needs to know
 * about "the next function match", so it takes a small callback
 * (`parseFunction`) instead of owning the whole compiler — this keeps the
 * dependency direction one-way (Compiler -> FieldParser -> Cursor) instead
 * of the original circular "Compiler calls itself through many privates".
 */
export declare class FieldParser {
    private readonly cursor;
    private readonly template;
    /** Parses the function at the current match and advances past it. */
    private readonly parseFunction;
    /** Current pending match, without consuming it. */
    private readonly nextMatch;
    /** If a match starts exactly at `index`, drop it (it was escaped) and advance past it. */
    private readonly dropMatchIfAt;
    private readonly reportError;
    constructor(cursor: Cursor, template: TemplateCompiler, 
    /** Parses the function at the current match and advances past it. */
    parseFunction: () => ICompiledFunction, 
    /** Current pending match, without consuming it. */
    nextMatch: () => IRawFunctionMatch | undefined, 
    /** If a match starts exactly at `index`, drop it (it was escaped) and advance past it. */
    dropMatchIfAt: (index: number) => void, reportError: (message: string) => never);
    parseAnyField(ref: IRawFunctionMatch, field: IRawField): ICompiledField;
    private parseNormal;
    private parseCondition;
    /** Shared char-by-char scanning used by both normal and condition fields. */
    private scan;
}
//# sourceMappingURL=FieldParser.d.ts.map