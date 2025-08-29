"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$setAuditLogReason",
    description: "Sets the reason for audit log entries",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "reason",
            description: "The reason to set",
            rest: false,
            required: true,
            type: structures_1.ArgType.String
        },
    ],
    execute(ctx, [reason]) {
        ctx.reason = reason;
        return this.success();
    },
});
//# sourceMappingURL=setAuditLogReason.js.map