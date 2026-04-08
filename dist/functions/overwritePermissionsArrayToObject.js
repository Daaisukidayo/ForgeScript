"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function default_1(arr) {
    const obj = {};
    for (let i = 0, len = arr.length; i < len; i++) {
        const data = arr[i];
        obj[data.permission] = data.value;
    }
    return obj;
}
//# sourceMappingURL=overwritePermissionsArrayToObject.js.map