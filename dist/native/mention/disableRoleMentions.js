"use strict";
/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$disableRoleMentions",
    version: "1.3.0",
    description: "Disables all role mentions",
    unwrap: false,
    execute(ctx) {
        ctx.container.unparseMention("roles");
        ctx.container.allowedMentions.roles = [];
        return this.success();
    },
});
//# sourceMappingURL=disableRoleMentions.js.map