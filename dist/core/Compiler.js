"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = exports.Syntax = void 0;
const CompiledFunction_1 = require("../structures/@internal/CompiledFunction");
const Cursor_1 = require("./Cursor");
const FieldParser_1 = require("./FieldParser");
const FunctionRegistry_1 = require("./FunctionRegistry");
const TemplateCompiler_1 = require("./TemplateCompiler");
const types_1 = require("./types");
exports.Syntax = {
    Open: "[",
    Close: "]",
    Escape: "\\",
    Count: "@",
    Negation: "!",
    Separator: ";",
    Silent: "#",
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
class Compiler {
    path;
    code;
    registry;
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
    static defaultRegistry = new FunctionRegistry_1.FunctionRegistry();
    cursor;
    template = new TemplateCompiler_1.TemplateCompiler();
    fieldParser;
    matches;
    matchIndex = 0;
    nextId = 0;
    outputFunctions = [];
    outputCode = "";
    constructor(path, code, registry) {
        this.path = path;
        this.code = code;
        this.registry = registry;
        this.cursor = new Cursor_1.Cursor(code ?? "");
        this.matches = code ? this.findMatches(code) : [];
        this.fieldParser = new FieldParser_1.FieldParser(this.cursor, this.template, () => this.parseFunction(), () => this.currentMatch(), (index) => this.dropMatchIfAt(index), (message) => this.error(message));
    }
    /** Registers/updates functions on the default, process-wide registry. */
    static setFunctions(fns) {
        this.defaultRegistry.register(fns);
    }
    static compile(code, path, registry = this.defaultRegistry) {
        const result = new Compiler(path, code, registry).compile();
        return {
            ...result,
            functions: result.functions.map((x) => new CompiledFunction_1.CompiledFunction(x)),
        };
    }
    compile() {
        if (this.matches.length === 0) {
            this.outputCode = this.code ?? "";
        }
        else {
            let match;
            while ((match = this.currentMatch()) !== undefined) {
                this.consumeTextUntil(match.index);
                const parsed = this.parseFunction();
                this.outputFunctions.push(parsed);
                this.outputCode += parsed.id;
            }
            this.outputCode += this.cursor.sliceFrom(this.cursor.position);
        }
        return {
            code: this.outputCode,
            functions: this.outputFunctions,
            resolve: this.template.wrap(this.outputCode),
        };
    }
    /** Copies raw text (handling escapes) up to `targetIndex` into the output. */
    consumeTextUntil(targetIndex) {
        while (this.cursor.position !== targetIndex) {
            const char = this.cursor.char();
            if (char === exports.Syntax.Escape) {
                this.cursor.skip(1);
                const escaped = this.cursor.char();
                this.dropMatchIfAt(this.cursor.position);
                this.outputCode += escaped;
                this.cursor.skip(1);
                continue;
            }
            this.outputCode += char;
            this.cursor.skip(1);
        }
    }
    parseFunction() {
        const match = this.matches[this.matchIndex++];
        this.cursor.skip(match.length);
        const hasFields = this.cursor.char() === exports.Syntax.Open;
        if (!hasFields && match.fn.args?.required) {
            this.error(`Function ${match.fn.name} requires brackets`);
        }
        if (!hasFields || match.fn.args === null) {
            return this.prepareFunction(match, null);
        }
        this.cursor.skip(1); // consume '['
        const fields = [];
        const definitions = match.fn.args.fields;
        for (let i = 0; i < definitions.length; i++) {
            const isLast = i + 1 === definitions.length;
            const field = definitions[i];
            if (!field.rest) {
                fields.push(this.fieldParser.parseAnyField(match, field));
            }
            else {
                do {
                    fields.push(this.fieldParser.parseAnyField(match, field));
                } while (this.cursor.back() === exports.Syntax.Separator);
            }
            const hadSeparator = this.cursor.back() === exports.Syntax.Separator;
            if (!hadSeparator)
                break;
            if (isLast) {
                this.error(`Function ${match.fn.name} expects ${definitions.length} arguments at most`);
            }
        }
        return this.prepareFunction(match, fields);
    }
    prepareFunction(match, fields) {
        const id = `[SYSTEM_FUNCTION(${this.nextId})]`;
        return {
            index: this.nextId++,
            id,
            fields,
            count: match.count,
            silent: match.silent,
            name: match.fn.name,
            negated: match.negated,
        };
    }
    currentMatch() {
        return this.matches[this.matchIndex];
    }
    dropMatchIfAt(index) {
        if (this.currentMatch()?.index === index)
            this.matchIndex++;
    }
    findMatches(code) {
        return Array.from(code.matchAll(this.registry.regex)).map((m) => ({
            index: m.index,
            negated: !!m[1],
            silent: !!m[2],
            length: m[0].length,
            count: m[4] ?? null,
            fn: this.resolveFunction(m[5]),
        }));
    }
    resolveFunction(name) {
        const fn = this.registry.resolve(name);
        if (!fn)
            this.error(`Function $${name.toLowerCase()} is not registered.`);
        return fn;
    }
    error(message) {
        const { line, column } = this.cursor.locate();
        throw new types_1.CompilerSyntaxError(message, line, column, this.path ?? "index file");
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map