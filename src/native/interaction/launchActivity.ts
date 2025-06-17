import { NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$launchActivity",
    version: "2.4.0",
    description: "Launches the activity of the client, if enabled",
    unwrap: false,
    async execute(ctx) {
        if (ctx.interaction && "launchActivity" in ctx.interaction) {
            await ctx.interaction.launchActivity()
        }
        return this.success()
    },
})