"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$botUserAuthorizationCount",
    aliases: ["$clientUserAuthorizationCount"],
    description: "Returns the user authorization count of the bot",
    unwrap: false,
    output: structures_1.ArgType.Number,
    execute(ctx) {
        return this.success(ctx.client.application.approximateUserAuthorizationCount);
    },
});
//# sourceMappingURL=botUserAuthorizationCount.js.map