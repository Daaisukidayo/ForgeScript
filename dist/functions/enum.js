"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNumericEnum = exports.enumToArray = void 0;
function enumToArray(x) {
    return Object.keys(x).filter((x) => isNaN(Number(x)));
}
exports.enumToArray = enumToArray;
function resolveNumericEnum(en, value) {
    return typeof (value) === "string" ? en[value] : value;
}
exports.resolveNumericEnum = resolveNumericEnum;
//# sourceMappingURL=enum.js.map