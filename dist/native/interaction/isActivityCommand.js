"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$isActivityCommand",
    description: "Returns whether the interaction is an activity command",
    unwrap: false,
    output: structures_1.ArgType.Boolean,
    execute(ctx) {
        return this.success(Boolean(ctx.interaction?.isPrimaryEntryPointCommand()));
    },
});
//# sourceMappingURL=isActivityCommand.js.map