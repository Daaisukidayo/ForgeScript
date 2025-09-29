/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { generateAdvancedBar, generateBar } from "../functions/generateBar"

console.log(
    generateAdvancedBar(
        100,
        100,
        10,
        [
            "=",
            "~",
            "#"
        ]
    )
)