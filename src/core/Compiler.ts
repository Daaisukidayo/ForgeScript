/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { CompiledFunction } from "../structures/@internal/CompiledFunction"
import { Cursor } from "./Cursor"
import { FieldParser } from "./FieldParser"
import { FunctionRegistry } from "./FunctionRegistry"
import { TemplateCompiler } from "./TemplateCompiler"
import {
    CompilerSyntaxError,
    ICompilationResult,
    ICompiledField,
    ICompiledFunction,
    IRawFunction,
    IRawFunctionMatch,
} from "./types"

export interface IExtendedCompilationResult extends Omit<ICompilationResult, "functions"> {
    functions: CompiledFunction[]
}

export const Syntax = {
    Open: "[",
    Close: "]",
    Escape: "\\",
    Count: "@",
    Negation: "!",
    Separator: ";",
    Silent: "#",
} as const

/**
 * Compiles ForgeScript source into an executable representation.
 *
 * Unlike the original implementation, this is a plain instantiable class:
 * no static mutable registry/regex, no `this.code!` non-null assertions
 * scattered around, and the actual work is delegated to small focused
 * collaborators (Cursor, FieldParser, TemplateCompiler) so each can be
 * tested and reasoned about on its own.
 */
export class Compiler {
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
    public static readonly defaultRegistry = new FunctionRegistry()

    private readonly cursor: Cursor
    private readonly template = new TemplateCompiler()
    private readonly fieldParser: FieldParser
    private readonly matches: IRawFunctionMatch[]

    private matchIndex = 0
    private nextId = 0
    private outputFunctions: ICompiledFunction[] = []
    private outputCode = ""

    private constructor(
        private readonly path: string | null | undefined,
        private readonly code: string | undefined,
        private readonly registry: FunctionRegistry
    ) {
        this.cursor = new Cursor(code ?? "")
        this.matches = code ? this.findMatches(code) : []
        this.fieldParser = new FieldParser(
            this.cursor,
            this.template,
            () => this.parseFunction(),
            () => this.currentMatch(),
            (index) => this.dropMatchIfAt(index),
            (message) => this.error(message)
        )
    }

    /** Registers/updates functions on the default, process-wide registry. */
    public static setFunctions(fns: IRawFunction[]): void {
        this.defaultRegistry.register(fns)
    }

    public static compile(
        code?: string,
        path?: string | null,
        registry: FunctionRegistry = this.defaultRegistry
    ): IExtendedCompilationResult {
        const result = new Compiler(path, code, registry).compile()
        return {
            ...result,
            functions: result.functions.map((x) => new CompiledFunction(x)),
        }
    }

    private compile(): ICompilationResult {
        if (this.matches.length === 0) {
            this.outputCode = this.code ?? ""
        } else {
            let match: IRawFunctionMatch | undefined
            while ((match = this.currentMatch()) !== undefined) {
                this.consumeTextUntil(match.index)

                const parsed = this.parseFunction()
                this.outputFunctions.push(parsed)
                this.outputCode += parsed.id
            }
            this.outputCode += this.cursor.sliceFrom(this.cursor.position)
        }

        return {
            code: this.outputCode,
            functions: this.outputFunctions,
            resolve: this.template.wrap(this.outputCode),
        }
    }

    /** Copies raw text (handling escapes) up to `targetIndex` into the output. */
    private consumeTextUntil(targetIndex: number): void {
        while (this.cursor.position !== targetIndex) {
            const char = this.cursor.char()!
            if (char === Syntax.Escape) {
                this.cursor.skip(1)
                const escaped = this.cursor.char()
                this.dropMatchIfAt(this.cursor.position)
                this.outputCode += escaped
                this.cursor.skip(1)
                continue
            }
            this.outputCode += char
            this.cursor.skip(1)
        }
    }

    private parseFunction(): ICompiledFunction {
        const match = this.matches[this.matchIndex++]
        this.cursor.skip(match.length)

        const hasFields = this.cursor.char() === Syntax.Open
        if (!hasFields && match.fn.args?.required) {
            this.error(`Function ${match.fn.name} requires brackets`)
        }
        if (!hasFields || match.fn.args === null) {
            return this.prepareFunction(match, null)
        }

        this.cursor.skip(1) // consume '['
        const fields: ICompiledField[] = []
        const definitions = match.fn.args!.fields

        for (let i = 0; i < definitions.length; i++) {
            const isLast = i + 1 === definitions.length
            const field = definitions[i]

            if (!field.rest) {
                fields.push(this.fieldParser.parseAnyField(match, field))
            } else {
                do {
                    fields.push(this.fieldParser.parseAnyField(match, field))
                } while (this.cursor.back() === Syntax.Separator)
            }

            const hadSeparator = this.cursor.back() === Syntax.Separator
            if (!hadSeparator) break
            if (isLast) {
                this.error(`Function ${match.fn.name} expects ${definitions.length} arguments at most`)
            }
        }

        return this.prepareFunction(match, fields)
    }

    private prepareFunction(match: IRawFunctionMatch, fields: ICompiledField[] | null): ICompiledFunction {
        const id = `[SYSTEM_FUNCTION(${this.nextId})]`
        return {
            index: this.nextId++,
            id,
            fields,
            count: match.count,
            silent: match.silent,
            name: match.fn.name,
            negated: match.negated,
        }
    }

    private currentMatch(): IRawFunctionMatch | undefined {
        return this.matches[this.matchIndex]
    }

    private dropMatchIfAt(index: number): void {
        if (this.currentMatch()?.index === index) this.matchIndex++
    }

    private findMatches(code: string): IRawFunctionMatch[] {
        return Array.from(code.matchAll(this.registry.regex)).map((m) => ({
            index: m.index!,
            negated: !!m[1],
            silent: !!m[2],
            length: m[0].length,
            count: m[4] ?? null,
            fn: this.resolveFunction(m[5]),
        }))
    }

    private resolveFunction(name: string): IRawFunction {
        const fn = this.registry.resolve(name)
        if (!fn) this.error(`Function $${name.toLowerCase()} is not registered.`)
        return fn
    }

    private error(message: string): never {
        const { line, column } = this.cursor.locate()
        throw new CompilerSyntaxError(message, line, column, this.path ?? "index file")
    }
}
