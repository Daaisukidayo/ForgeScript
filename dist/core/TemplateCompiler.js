"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateCompiler = void 0;
const Conditions_1 = require("./Conditions");
const INVALID_CHAR_REGEX = /(\\|\${|`)/g;
const SYSTEM_PLACEHOLDER_REGEX = /(\\+)?\[SYSTEM_FUNCTION\(\d+\)\]/gm;
/**
 * Everything related to turning a parsed field's raw text into an
 * executable `WrappedCode` lives here, separate from parsing. If you
 * ever want to swap `new Function` for a safer/faster template
 * evaluator (e.g. a tokenized substitution array instead of eval'd
 * JS), this is the only file that needs to change.
 */
class TemplateCompiler {
    wrap(code) {
        let i = 0;
        const escaped = code
            .replace(INVALID_CHAR_REGEX, "\\$1")
            .replace(SYSTEM_PLACEHOLDER_REGEX, () => "${args[" + i++ + "] ?? ''}");
        // NOTE: still uses `new Function`, same as the original. Kept as-is
        // to preserve behaviour, but now isolated so it can be replaced
        // with a non-eval template renderer without touching the parser.
        return new Function("args", "return `" + escaped + "`");
    }
    wrapCondition(op) {
        return Conditions_1.Conditions[op];
    }
}
exports.TemplateCompiler = TemplateCompiler;
//# sourceMappingURL=TemplateCompiler.js.map