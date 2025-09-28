"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(arr) {
    const obj = {};
    for (let i = 0, len = arr.length; i < len; i++) {
        const data = arr[i];
        obj[data.permission] = data.value;
    }
    return obj;
}
exports.default = default_1;
//# sourceMappingURL=overwritePermissionsArrayToObject.js.map