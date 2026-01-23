/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { ArgType, NativeFunction } from "../../structures/@internal/NativeFunction"
import { Return } from "../../structures/@internal/Return"

export default new NativeFunction({
    name: "$messageContent",
    version: "1.4.0",
    output: ArgType.String,
    description: "Retrieves the content of the message",
    unwrap: false,
    execute(ctx) {
        return this.success(ctx.message?.content)
    },
})
