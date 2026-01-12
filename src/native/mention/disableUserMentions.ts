/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { NativeFunction } from "../../structures"

export default new NativeFunction({
    name: "$disableUserMentions",
    version: "1.3.0",
    description: "Disables all user mentions",
    unwrap: false,
    execute(ctx) {
        ctx.container.unparseMentions("users")
        ctx.container.allowedMentions.users = []
        return this.success()
    },
})