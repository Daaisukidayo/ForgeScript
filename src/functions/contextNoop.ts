/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { Context, Logger } from "../structures"

export default function(this: Context, ...args: any[]) {
    if (this.hasDisabledConsoleErrors()) {
        return
    } 

    Logger.error(...args)
}