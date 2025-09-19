import { ArgType, CompiledFunction, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$findApplicationEmoji",
    version: "2.2.0",
    description: "Finds an application emoji of the client",
    brackets: true,
    output: ArgType.ApplicationEmoji,
    args: [
        {
            name: "query",
            description: "The id, format or emoji name to find",
            rest: false,
            type: ArgType.String,
            required: true,
        },
    ],
    unwrap: true,
    async execute(ctx, [q]) {
        if (!ctx.client.application.emojis.cache.size) await ctx.fetchApplicationEmojis()

        if (CompiledFunction.IdRegex.test(q)) {
            const e = ctx.client.application.emojis.cache.get(q)
            if (e) return this.success(e.id)
        }

        return this.success(
            ctx.client.application.emojis.cache.find((x) => x.id === q || x.name?.toLowerCase() === q.toLowerCase() || x.toString() === q)?.id
        )
    },
})