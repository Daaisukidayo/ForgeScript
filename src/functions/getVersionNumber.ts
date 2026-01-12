/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

export default function(v: string) {
    return Number(v.replace(/\./g, ""))
}