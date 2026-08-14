"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionRegistry = void 0;
const ESCAPE_REGEX = /(\.|\$|\(|\)|\*|\[|\]|\{|\}|\?|!|\^)/gim;
/**
 * Holds registered functions and builds the matching regex for a *single*
 * compiler instance. Unlike the original `Compiler.Functions` /
 * `Compiler.Regex` static fields, this is not shared global state — you can
 * have multiple independent registries (e.g. per-bot, per-test) in the same
 * process without them interfering with each other.
 */
class FunctionRegistry {
    byName = new Map();
    cachedRegex = null;
    register(fns) {
        for (const fn of fns) {
            this.byName.set(fn.name.toLowerCase(), fn);
            for (const alias of fn.aliases ?? []) {
                if (typeof alias === "string")
                    this.byName.set(alias.toLowerCase(), fn);
            }
        }
        this.cachedRegex = null; // invalidate cache
        return this;
    }
    resolve(name) {
        const key = `$${name.toLowerCase()}`;
        const direct = this.byName.get(key);
        if (direct)
            return direct;
        for (const fn of this.byName.values()) {
            if (fn.aliases?.some((a) => a.toLowerCase() === key))
                return fn;
        }
        return undefined;
    }
    get regex() {
        if (!this.cachedRegex)
            this.cachedRegex = this.buildRegex();
        return this.cachedRegex;
    }
    buildRegex() {
        const names = Array.from(this.byName.keys())
            .map((name) => (name.startsWith("$") ? name.slice(1) : name))
            .map((name) => name.replace(ESCAPE_REGEX, "\\$1"))
            .sort((a, b) => b.length - a.length); // longest-first avoids prefix shadowing
        return new RegExp(`\\$(\\!)?(\\#)?(@\\[(.*?)\\])?(${names.join("|")})`, "gim");
    }
}
exports.FunctionRegistry = FunctionRegistry;
//# sourceMappingURL=FunctionRegistry.js.map