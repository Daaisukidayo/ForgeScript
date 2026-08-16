/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import isTrue from "../../functions/isTrue"
import { ArgType, IExtendedCompiledFunctionField, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$arrayEvery",
    version: "1.0.0",
    description: "Loops through every element of the array with a condition that must pass every element",
    unwrap: false,
    experimental: true,
    args: [
        {
            name: "name",
            description: "The variable that holds the array",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "variable",
            description: "The variable to load the element value to",
            rest: false,
            required: true,
            type: ArgType.String,
        },
        {
            name: "code",
            description: "The code to execute for every element",
            rest: false,
            required: true,
            type: ArgType.String,
        },
    ],
    output: ArgType.Boolean,
    brackets: true,
    async execute(ctx) {
        const code = this.data.fields![2] as IExtendedCompiledFunctionField

        const { args: [ nameField, varField ], return: rt } = await this["resolveMultipleArgs"](ctx, 0, 1)
        if (!this["isValidReturnType"](rt)) 
            return rt

        const arr = ctx.getParamOrEnvKey(nameField)

        if (Array.isArray(arr)) {
            for (let i = 0, len = arr.length; i < len; i++) {
                ctx.setParamKey(varField, arr[i])
                const rt = (await this["resolveCode"](ctx, code)) as Return

                if (rt.return || rt.success) {
                    if (isTrue(rt)) continue
                    return this.success(false)
                } else if (!this["isValidReturnType"](rt)) return rt
            }
        }

        return this.success(true)
    },
})
