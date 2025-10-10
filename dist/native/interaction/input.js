"use strict";
/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$input",
    version: "1.0.0",
    description: "Returns a value from a modal field",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "custom ID",
            description: "The custom id to get its field value",
            rest: false,
            type: structures_1.ArgType.String,
            required: true,
        },
        {
            name: "separator",
            description: "The separator to use in case of array",
            rest: false,
            type: structures_1.ArgType.String,
        },
    ],
    output: structures_1.ArgType.String,
    execute(ctx, [id, sep]) {
        if (!ctx.interaction?.isModalSubmit())
            return this.success();
        const field = ctx.interaction.fields.getField(id);
        return this.success("value" in field ? field.value : field.values.join(sep ?? ", "));
    },
});
//# sourceMappingURL=input.js.map