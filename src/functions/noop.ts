/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { DiscordAPIError } from "discord.js"
import { inspect } from "node:util"
import { Logger } from "../structures/@internal/Logger"

export default (...args: any[]) => {
    Logger.error(...args)
}
