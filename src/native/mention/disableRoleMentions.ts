/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { NativeFunction } from "../../structures"

export default new NativeFunction({
    name: "$disableRoleMentions",
    version: "1.3.0",
    description: "Disables all role mentions",
    unwrap: false,
    execute(ctx) {
        ctx.container.unparseMention("roles")
        ctx.container.allowedMentions.roles = []
        return this.success()
    },
})