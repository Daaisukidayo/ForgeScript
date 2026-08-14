"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompilerSyntaxError = exports.Operators = exports.OperatorType = void 0;
var OperatorType;
(function (OperatorType) {
    OperatorType["Eq"] = "==";
    OperatorType["NotEq"] = "!=";
    OperatorType["Lte"] = "<=";
    OperatorType["Gte"] = ">=";
    OperatorType["Gt"] = ">";
    OperatorType["Lt"] = "<";
    OperatorType["None"] = "unknown";
})(OperatorType || (exports.OperatorType = OperatorType = {}));
exports.Operators = new Set(Object.values(OperatorType));
class CompilerSyntaxError extends Error {
    line;
    column;
    path;
    constructor(message, line, column, path) {
        super(`${message} (${path}:${line}:${column})`);
        this.line = line;
        this.column = column;
        this.path = path;
        this.name = "CompilerSyntaxError";
    }
}
exports.CompilerSyntaxError = CompilerSyntaxError;
//# sourceMappingURL=types.js.map