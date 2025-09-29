/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { CommandType } from "../structures"
import { BaseCommandManager } from "./BaseCommandManager"
import { NativeEventName } from "./EventManager"

export class NativeCommandManager extends BaseCommandManager<CommandType> {
    public handlerName = NativeEventName
}
