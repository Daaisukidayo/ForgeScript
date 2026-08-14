/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { Cursor } from "./Cursor"
import { TemplateCompiler } from "./TemplateCompiler"
import {
    ICompiledField,
    ICompiledFunction,
    ICompiledFunctionField,
    IRawField,
    IRawFunctionMatch,
    OperatorType,
    Operators,
} from "./types"

const SYNTAX = {
    Close: "]",
    Escape: "\\",
    Separator: ";",
} as const

/**
 * Parses one field (normal or condition) of a function call. Needs to know
 * about "the next function match", so it takes a small callback
 * (`parseFunction`) instead of owning the whole compiler — this keeps the
 * dependency direction one-way (Compiler -> FieldParser -> Cursor) instead
 * of the original circular "Compiler calls itself through many privates".
 */
export class FieldParser {
    constructor(
        private readonly cursor: Cursor,
        private readonly template: TemplateCompiler,
        /** Parses the function at the current match and advances past it. */
        private readonly parseFunction: () => ICompiledFunction,
        /** Current pending match, without consuming it. */
        private readonly nextMatch: () => IRawFunctionMatch | undefined,
        /** If a match starts exactly at `index`, drop it (it was escaped) and advance past it. */
        private readonly dropMatchIfAt: (index: number) => void,
        private readonly reportError: (message: string) => never
    ) {}

    public parseAnyField(ref: IRawFunctionMatch, field: IRawField): ICompiledField {
        const result = field.condition ? this.parseCondition(ref) : this.parseNormal(ref)
        this.cursor.skip(1) // consume separator/closing bracket
        return result
    }

    private parseNormal(ref: IRawFunctionMatch): ICompiledFunctionField {
        const start = this.cursor.position
        const { value, functions, closed } = this.scan()
        if (!closed) this.reportError(`Function ${ref.fn.name} is missing brace closure`)

        return {
            kind: "normal",
            value,
            rawValue: this.cursor.slice(start, this.cursor.position),
            functions,
            resolve: this.template.wrap(value),
        }
    }

    private parseCondition(ref: IRawFunctionMatch): ICompiledField {
        const start = this.cursor.position
        const first = this.scan({ stopAtOperator: true })

        if (!first.operator) {
            if (!first.closed) this.reportError(`Function ${ref.fn.name} is missing brace closure`)
            const rawValue = this.cursor.slice(start, this.cursor.position)
            return {
                kind: "condition",
                op: OperatorType.None,
                lhs: {
                    kind: "normal",
                    value: first.value,
                    rawValue,
                    functions: first.functions,
                    resolve: this.template.wrap(first.value),
                },
                resolve: this.template.wrapCondition(OperatorType.None),
                value: first.value,
                rawValue,
                functions: first.functions,
            }
        }

        const mid = this.cursor.position
        const second = this.scan()
        if (!second.closed) this.reportError(`Function ${ref.fn.name} is missing brace closure`)

        const lhs: ICompiledFunctionField = {
            kind: "normal",
            value: first.value,
            rawValue: this.cursor.slice(start, mid - first.operator.length),
            functions: first.functions,
            resolve: this.template.wrap(first.value),
        }
        const rhs: ICompiledFunctionField = {
            kind: "normal",
            value: second.value,
            rawValue: this.cursor.slice(mid, this.cursor.position),
            functions: second.functions,
            resolve: this.template.wrap(second.value),
        }

        return {
            kind: "condition",
            op: first.operator,
            lhs,
            rhs,
            resolve: this.template.wrapCondition(first.operator),
            value: second.value,
            rawValue: rhs.rawValue,
            functions: second.functions,
        }
    }

    /** Shared char-by-char scanning used by both normal and condition fields. */
    private scan(opts: { stopAtOperator?: boolean } = {}) {
        const functions: ICompiledFunction[] = []
        let value = ""
        let closed = false
        let operator: OperatorType | undefined

        let match = this.nextMatch()
        let char: string | undefined

        while ((char = this.cursor.char()) !== undefined) {
            if (char === SYNTAX.Escape) {
                this.cursor.skip(1)
                const escaped = this.cursor.char()
                // If the escaped char is itself the start of a would-be
                // function match, that match is bogus (it's escaped text,
                // not a real call) — drop it instead of parsing it.
                this.dropMatchIfAt(this.cursor.position)
                value += escaped
                this.cursor.skip(1)
                match = this.nextMatch()
                continue
            }

            if (char === SYNTAX.Close || char === SYNTAX.Separator) {
                closed = true
                break
            }

            if (match?.index === this.cursor.position) {
                const fn = this.parseFunction()
                functions.push(fn)
                value += fn.id
                match = this.nextMatch()
                continue
            }

            if (opts.stopAtOperator && operator === undefined) {
                const two = char + (this.cursor.peek() ?? "")
                const candidate = ([two, char] as OperatorType[]).find((op) => Operators.has(op))
                if (candidate) {
                    operator = candidate
                    this.cursor.skip(candidate.length)
                    break
                }
            }

            value += char
            this.cursor.skip(1)
        }

        return { value, functions, closed, operator }
    }
}
