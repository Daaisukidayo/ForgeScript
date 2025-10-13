/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { NativeFunction } from "../../structures"

export default new NativeFunction({
    name: "$showModal",
    version: "1.4.0",
    description: "Shows the modal immediately",
    unwrap: false,
    async execute(ctx) {
        if (ctx.interaction && "showModal" in ctx.interaction && ctx.container.modal) {
            await ctx.interaction.showModal(ctx.container.modal).catch(ctx.noop)
            ctx.container.reset()
        }
        
        return this.success()
    },
})