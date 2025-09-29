/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { FileReader } from "../core/FileReader"

console.log(
    new FileReader(
        `[name]

Ping

[type]

messageCreate

[code]
ping is $ping
`,
        {}
    ).read()
)
