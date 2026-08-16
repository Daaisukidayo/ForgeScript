/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { ArgType, NativeFunction } from "../../structures"

export default new NativeFunction({
    name: "$arrayReverse",
    version: "1.0.0",
    description: "Reverses an array and loads it to another variable",
    brackets: true,
    unwrap: true,
    args: [
        {
            name: "variable",
            description: "The variable where the array is held",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "other variable",
            description: "The variable to load the result to, leave empty to return output",
            rest: false,
            type: ArgType.String,
            required: false,
        },
    ],
    output: ArgType.Json,
    execute(ctx, [var1, var2]) {
        const arr = ctx.getParamOrEnvKey(var1)

        if (Array.isArray(arr)) {
            if (var2) {
                ctx.setEnvironmentKey(var2, arr.reverse())
                return this.success()
            } else return this.successJSON(arr.reverse())
        }

        return this.success()
    },
})
