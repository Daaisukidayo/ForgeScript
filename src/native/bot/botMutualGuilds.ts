/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import array from "../../functions/array"
import { ArgType, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$botMutualGuilds",
    version: "1.5.0",
    aliases: ["$clientMutualGuilds"],
    description: "Returns the client's mutual guilds with a user",
    unwrap: true,
    args: [
        {
            name: "user ID",
            description: "The user to get mutual guilds from",
            rest: false,
            required: true,
            type: ArgType.User,
        },
        {
            name: "separator",
            description: "The separator to use for every guild",
            rest: false,
            type: ArgType.String,
        },
    ],
    brackets: false,
    output: array<ArgType.Guild>(),
    async execute(ctx, [user, sep]) {
        user ??= ctx.user!
        return this.success(ctx.client.guilds.cache
            .filter(async (x) => await x.members.fetch(user).then(() => true).catch(() => false))
            .map(guild => guild.id)
            .join(sep || ", ")
        )
    },
})