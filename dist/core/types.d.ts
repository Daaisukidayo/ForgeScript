export interface IRawField {
    condition?: boolean;
    rest?: boolean;
}
export interface IRawFunctionFieldDefinition {
    required: boolean;
    fields: IRawField[];
}
export interface IRawFunction {
    aliases: null | string[];
    name: string;
    args: IRawFunctionFieldDefinition | null;
}
export type WrappedCode = (args: unknown[]) => string;
export type WrappedConditionCode = (lhs: unknown, rhs: unknown) => boolean;
export declare enum OperatorType {
    Eq = "==",
    NotEq = "!=",
    Lte = "<=",
    Gte = ">=",
    Gt = ">",
    Lt = "<",
    None = "unknown"
}
export declare const Operators: Set<OperatorType>;
interface IFieldBase {
    value: string;
    /**
     * Literal, unprocessed source text of the field — nested function calls
     * appear here verbatim (e.g. `$upper[hi]`), unlike `value`, where they've
     * been replaced by a `[SYSTEM_FUNCTION(n)]` placeholder. Needed by
     * functions like `$escapeCode` that must return code without executing it.
     */
    rawValue: string;
    functions: ICompiledFunction[];
}
export interface ICompiledFunctionField extends IFieldBase {
    kind: "normal";
    resolve: WrappedCode;
}
export interface ICompiledFunctionConditionField extends IFieldBase {
    kind: "condition";
    op: OperatorType;
    lhs: ICompiledFunctionField;
    rhs?: ICompiledFunctionField;
    resolve: WrappedConditionCode;
}
export type ICompiledField = ICompiledFunctionField | ICompiledFunctionConditionField;
export interface ILocation {
    line: number;
    column: number;
}
export interface ICompiledFunction {
    index: number;
    id: string;
    name: string;
    count: string | null;
    silent: boolean;
    negated: boolean;
    fields: null | ICompiledField[];
}
export interface ICompilationResult {
    code: string;
    functions: ICompiledFunction[];
    resolve: WrappedCode;
}
export interface IRawFunctionMatch {
    index: number;
    length: number;
    negated: boolean;
    silent: boolean;
    count: string | null;
    fn: IRawFunction;
}
export declare class CompilerSyntaxError extends Error {
    readonly line: number;
    readonly column: number;
    readonly path: string;
    constructor(message: string, line: number, column: number, path: string);
}
export {};
//# sourceMappingURL=types.d.ts.map