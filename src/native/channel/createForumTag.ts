import { BaseChannel, GuildForumTagData, ThreadOnlyChannel } from "discord.js"
import { ArgType, NativeFunction, Return } from "../../structures"
import { parseSingleEmoji } from "../../functions/parseSingleEmoji"

export default new NativeFunction({
    name: "$createForumTag",
    version: "2.5.0",
    description: "Creates a forum tag, returns tag id",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "channel ID",
            description: "The forum to create tag on",
            rest: false,
            required: true,
            type: ArgType.Channel,
            check: (i: BaseChannel) => i.isThreadOnly(),
        },
        {
            name: "name",
            description: "The name for the tag",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "emoji",
            description: "The emoji for the tag",
            rest: false,
            type: ArgType.String,
        },
        {
            name: "moderated",
            description: "Whether the tag can only be applied by mods",
            rest: false,
            type: ArgType.Boolean,
        }
    ],
    output: ArgType.ForumTag,
    async execute(ctx, [ channel, name, emoji, mod ]) {
        const forum = channel as ThreadOnlyChannel

        const tag = {
            name,
            emoji: parseSingleEmoji(ctx, emoji),
            moderated: mod || undefined
        } as GuildForumTagData

        return this.success((await forum.setAvailableTags([...forum.availableTags, tag]).catch(ctx.noop))?.availableTags.at(-1)?.id)
    },
})