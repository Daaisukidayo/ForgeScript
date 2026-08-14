/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

export interface IRawField {
    condition?: boolean
    rest?: boolean
}

export interface IRawFunctionFieldDefinition {
    required: boolean
    fields: IRawField[]
}

export interface IRawFunction {
    aliases: null | string[]
    name: string
    args: IRawFunctionFieldDefinition | null
}

export type WrappedCode = (args: unknown[]) => string
export type WrappedConditionCode = (lhs: unknown, rhs: unknown) => boolean

export enum OperatorType {
    Eq = "==",
    NotEq = "!=",
    Lte = "<=",
    Gte = ">=",
    Gt = ">",
    Lt = "<",
    None = "unknown",
}

export const Operators = new Set<OperatorType>(Object.values(OperatorType) as OperatorType[])

// Base shape shared by both field kinds.
interface IFieldBase {
    value: string
    /**
     * Literal, unprocessed source text of the field — nested function calls
     * appear here verbatim (e.g. `$upper[hi]`), unlike `value`, where they've
     * been replaced by a `[SYSTEM_FUNCTION(n)]` placeholder. Needed by
     * functions like `$escapeCode` that must return code without executing it.
     */
    rawValue: string
    functions: ICompiledFunction[]
}

// Discriminated union instead of "duck typing by presence of `op`"
// (the original codebase used `"op" in field` at every call site).
// Original type names are kept so downstream consumers (CompiledFunction,
// ForgeFunction, etc.) don't need to be renamed wholesale — they only need
// to switch their `"op" in x` checks to `x.kind === "condition"`.
export interface ICompiledFunctionField extends IFieldBase {
    kind: "normal"
    resolve: WrappedCode
}

export interface ICompiledFunctionConditionField extends IFieldBase {
    kind: "condition"
    op: OperatorType
    lhs: ICompiledFunctionField
    rhs?: ICompiledFunctionField
    resolve: WrappedConditionCode
}

export type ICompiledField = ICompiledFunctionField | ICompiledFunctionConditionField

export interface ILocation {
    line: number
    column: number
}

export interface ICompiledFunction {
    index: number
    id: string
    name: string
    count: string | null
    silent: boolean
    negated: boolean
    fields: null | ICompiledField[]
}

export interface ICompilationResult {
    code: string
    functions: ICompiledFunction[]
    resolve: WrappedCode
}



export interface IRawFunctionMatch {
    index: number
    length: number
    negated: boolean
    silent: boolean
    count: string | null
    fn: IRawFunction
}

export class CompilerSyntaxError extends Error {
    constructor(
        message: string,
        public readonly line: number,
        public readonly column: number,
        public readonly path: string
    ) {
        super(`${message} (${path}:${line}:${column})`)
        this.name = "CompilerSyntaxError"
    }
}
