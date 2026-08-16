/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import parseJSON from "../../functions/parseJSON"
import { ArgType, NativeFunction } from "../../structures"

export default new NativeFunction({
    name: "$jsonSet",
    version: "1.2.0",
    description: "Adds a JSON key with a value",
    unwrap: true,
    brackets: true,
    args: [
        {
            name: "keys;value",
            description: "The keys to traverse, with the value to use at the end",
            type: ArgType.String,
            rest: true,
            required: true
        }
    ],
    output: ArgType.Boolean,
    execute(ctx, [ keys ]) {
        const json = parseJSON(keys[keys.length - 1])
        const value = keys.slice(0, -1)
        const res = ctx.traverseAddParamOrEnvKey(json, ...value)
        return this.success(res)
    },
})