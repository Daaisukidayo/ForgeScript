"use strict";
/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$addLabel",
    description: "Adds a new label component to the modal",
    unwrap: false,
    brackets: true,
    args: [
        {
            name: "name",
            description: "The name for the label",
            rest: false,
            required: true,
            type: structures_1.ArgType.String,
        },
        {
            name: "component",
            description: "The component to attach to the label",
            rest: false,
            required: true,
            type: structures_1.ArgType.String,
        },
        {
            name: "description",
            description: "The description for the label",
            rest: false,
            type: structures_1.ArgType.String,
        },
        {
            name: "required",
            description: "Whether this field is required",
            rest: false,
            type: structures_1.ArgType.Boolean,
        },
    ],
    async execute(ctx) {
        if (!ctx.interaction)
            return this.success();
        ctx.container.inside.push(discord_js_1.ComponentType.Label);
        const { args, return: rt } = await this["resolveMultipleArgs"](ctx, 0, 2, 3);
        if (!this["isValidReturnType"](rt))
            return rt;
        const [name, desc, required] = args;
        const label = new discord_js_1.LabelBuilder().setLabel(name);
        if (desc)
            label.setDescription(desc);
        ctx.component.label = label;
        ctx.component.required = required || false;
        const code = this.data.fields[1];
        const resolved = await this["resolveCode"](ctx, code);
        if (!this["isValidReturnType"](resolved))
            return resolved;
        ctx.container.modal?.addLabelComponents(ctx.component.label);
        ctx.component = {};
        ctx.container.inside.pop();
        return this.success();
    },
});
//# sourceMappingURL=addLabel.js.map