/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "fs"
import { join, resolve } from "path"

const LICENSE = `/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/`

const dir = resolve("src")

function log(msg: string) {
    const time = new Date().toLocaleTimeString()
    console.log(`[${time}] ${msg}`)
}

if (!existsSync(dir)) {
    console.error("src folder not found")
    process.exit(1)
}

const isTs = (file: string)  => file.endsWith(".ts")

function addHeaderIfMissing(filePath: string) {
    try {
        const content = readFileSync(filePath, "utf8")
        const c = content.split("\n")
        const l = LICENSE.split("\n")
        let i = 0
        for(const line of c) {
            if(line.startsWith(l[i])) i++
            else break
        }
        if(i === l.length) return false
        writeFileSync(filePath, `${LICENSE}\n\n${content}`)
        log(`Added license header → ${filePath}`)
        return true
    } catch {
        return false
    }
}

function scanDir(dir: string) {
    for (const entry of readdirSync(dir)) {
        const full = join(dir, entry)
        const st = statSync(full)
        if (st.isDirectory()) scanDir(full)
        else if (st.isFile() && isTs(full)) addHeaderIfMissing(full)
    }
}

log("Scanning existing files for missing headers…")
scanDir(dir)
log("Completed the scan.")