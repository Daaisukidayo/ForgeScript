/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import express from "express"
const app = express()
app.use(express.static("./docs"))
app.listen(3000)
