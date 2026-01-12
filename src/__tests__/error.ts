/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { ErrorType, ForgeError } from "../structures/forge/ForgeError"

console.log(new ForgeError(null, ErrorType.InvalidArgType, "cope", "id", "User"))
