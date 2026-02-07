"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const structures_1 = require("../../structures");
exports.default = new structures_1.NativeFunction({
    name: "$pathExtensionName",
    version: "2.7.0",
    description: "Returns the extension name of a path",
    aliases: ["$pathExtName"],
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "path",
            description: "The path to get extension name from",
            rest: false,
            required: true,
            type: structures_1.ArgType.String,
        },
    ],
    output: structures_1.ArgType.String,
    execute(ctx, [p]) {
        return this.success(path_1.default.extname(p));
    },
});
//# sourceMappingURL=pathExtensionName.js.map