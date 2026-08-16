/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import isTrue from "../../functions/isTrue"
import { ArgType, IExtendedCompiledFunctionConditionField, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$arraySome",
    version: "1.0.0",
    description: "Loops through every element of the array to find a match",
    unwrap: false,
    output: ArgType.Boolean,
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
            condition: true,
            required: true,
            type: ArgType.String,
        },
    ],
    brackets: true,
    async execute(ctx) {
        const code = this.data.fields![2] as IExtendedCompiledFunctionConditionField

        const { args, return: rt,} = await this["resolveMultipleArgs"](ctx, 0, 1)
        if (!this["isValidReturnType"](rt)) return rt
        const [name, variable] = args

        const arr = ctx.getParamOrEnvKey(name)

        if (Array.isArray(arr)) {
            for (let i = 0, len = arr.length; i < len; i++) {
                const el = arr[i]
                ctx.setParamKey(variable, el)
                const rt = await this["resolveCondition"](ctx, code) as Return

                if (rt.return || rt.success) {
                    if (!isTrue(rt)) continue
                    return this.success(true)
                } else if (!this["isValidReturnType"](rt)) return rt
            }
        }

        return this.success(false)
    },
})
