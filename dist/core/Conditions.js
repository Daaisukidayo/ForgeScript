"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Conditions = void 0;
const types_1 = require("./types");
exports.Conditions = {
    [types_1.OperatorType.None]: (lhs) => lhs === "true",
    [types_1.OperatorType.NotEq]: (lhs, rhs) => lhs !== rhs,
    [types_1.OperatorType.Eq]: (lhs, rhs) => lhs === rhs,
    [types_1.OperatorType.Lt]: (lhs, rhs) => Number(lhs) < Number(rhs),
    [types_1.OperatorType.Lte]: (lhs, rhs) => Number(lhs) <= Number(rhs),
    [types_1.OperatorType.Gt]: (lhs, rhs) => Number(lhs) > Number(rhs),
    [types_1.OperatorType.Gte]: (lhs, rhs) => Number(lhs) >= Number(rhs),
};
//# sourceMappingURL=Conditions.js.map