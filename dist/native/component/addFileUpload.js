"use strict";
/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$addFileUpload",
    version: "2.6.0",
    description: "Adds a new file upload component to the modal label",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "custom ID",
            description: "The custom id for this field",
            rest: false,
            required: true,
            type: structures_1.ArgType.String,
        },
        {
            name: "min values",
            description: "The min values of file uploads",
            rest: false,
            type: structures_1.ArgType.Number,
        },
        {
            name: "max values",
            description: "The max values of file uploads",
            rest: false,
            type: structures_1.ArgType.Number,
        },
    ],
    execute(ctx, [id, min, max]) {
        const field = new discord_js_1.FileUploadBuilder()
            .setCustomId(id)
            .setRequired(ctx.component.required);
        if (min)
            field.setMinValues(min);
        if (max)
            field.setMaxValues(max);
        ctx.component.label?.setFileUploadComponent(field);
        return this.success();
    },
});
//# sourceMappingURL=addFileUpload.js.map