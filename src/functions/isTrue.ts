/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { Return } from "../structures"

export default function(t: Return) {
    return t.value === "true" || t.value === true
}