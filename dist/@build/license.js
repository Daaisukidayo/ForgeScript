"use strict";
/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const LICENSE = `/*
* SPDX-License-Identifier: GPL-3.0-or-later
* Copyright © 2025 BotForge
*/`;
const dir = (0, path_1.resolve)("src");
function log(msg) {
    const time = new Date().toLocaleTimeString();
    console.log(`[${time}] ${msg}`);
}
if (!(0, fs_1.existsSync)(dir)) {
    console.error("src folder not found");
    process.exit(1);
}
const isTs = (file) => file.endsWith(".ts");
function addHeaderIfMissing(filePath) {
    try {
        const content = (0, fs_1.readFileSync)(filePath, "utf8");
        const c = content.split("\n");
        const l = LICENSE.split("\n");
        let i = 0;
        for (const line of c) {
            if (line.startsWith(l[i]))
                i++;
            else
                break;
        }
        if (i === l.length)
            return false;
        (0, fs_1.writeFileSync)(filePath, `${LICENSE}\n\n${content}`);
        log(`Added license header → ${filePath}`);
        return true;
    }
    catch {
        return false;
    }
}
function scanDir(dir) {
    for (const entry of (0, fs_1.readdirSync)(dir)) {
        const full = (0, path_1.join)(dir, entry);
        const st = (0, fs_1.statSync)(full);
        if (st.isDirectory())
            scanDir(full);
        else if (st.isFile() && isTs(full))
            addHeaderIfMissing(full);
    }
}
log("Scanning existing files for missing headers…");
scanDir(dir);
log("Completed the scan.");
//# sourceMappingURL=license.js.map