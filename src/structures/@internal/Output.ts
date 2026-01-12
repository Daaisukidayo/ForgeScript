/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { ReturnType } from "./Return"

export class Output<R extends [...ReturnType[]]> {
    public constructor(
        public readonly types: R
    ) {

    }
}