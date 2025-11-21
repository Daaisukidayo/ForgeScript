/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { User } from "discord.js"
import { ArgType, NativeFunction } from "../../structures"

export default new NativeFunction({
    name: "$emojiAuthorID",
    version: "2.6.0",
    description: "Returns the author id of an emoji",
    brackets: false,
    unwrap: true,
    args: [
        {
            name: "emoji ID",
            description: "The emoji to return its author",
            rest: false,
            required: true,
            type: ArgType.Emoji,
        },
    ],
    output: ArgType.User,
    execute(ctx, [emoji]) {
        emoji ??= ctx.emoji!
        return this.success(emoji && "author" in emoji ? (emoji.author as User | null)?.id : undefined)
    },
})