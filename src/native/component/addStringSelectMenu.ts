/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { ComponentType, StringSelectMenuBuilder } from "discord.js"
import { ArgType, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$addStringSelectMenu",
    version: "1.0.0",
    description: "Creates a string select menu",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "custom ID",
            description: "The custom id to use for this menu",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "placeholder",
            description: "The placeholder to use for the menu",
            rest: false,
            type: ArgType.String,
        },
        {
            name: "disabled",
            description: "Whether to keep this menu disabled",
            type: ArgType.Boolean,
            rest: false,
        },
        {
            name: "min values",
            description: "The min values to choose for the menu",
            rest: false,
            type: ArgType.Number,
        },
        {
            name: "max values",
            description: "The max values to choose for the menu",
            rest: false,
            type: ArgType.Number,
        },
    ],
    execute(ctx, [id, placeholder, disabled, min, max]) {
        const menu = new StringSelectMenuBuilder()
            .setCustomId(id)
            .setDisabled(disabled || false)
            .setRequired(ctx.component.required)

        if (placeholder) menu.setPlaceholder(placeholder)
        if (min) menu.setMinValues(min)
        if (max) menu.setMaxValues(max)

        if (ctx.container.isInside(ComponentType.Label)) ctx.component.label?.setStringSelectMenuComponent(menu)
        else ctx.container.actionRow?.addComponents(menu)

        return this.success()
    },
})