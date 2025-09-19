import { ArgType, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$fetchApplicationEmojis",
    version: "2.5.0",
    description: "Caches all application emojis of the client",
    unwrap: false,
    async execute(ctx) {
        await ctx.fetchApplicationEmojis()
        return this.success()
    },
})