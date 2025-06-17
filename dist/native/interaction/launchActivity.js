"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$launchActivity",
    description: "Launches the activity of the client, if enabled",
    unwrap: false,
    async execute(ctx) {
        if (ctx.interaction && "launchActivity" in ctx.interaction) {
            await ctx.interaction.launchActivity();
        }
        return this.success();
    },
});
//# sourceMappingURL=launchActivity.js.map