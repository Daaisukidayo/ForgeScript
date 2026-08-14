/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { IRawFunction } from "./types"

const ESCAPE_REGEX = /(\.|\$|\(|\)|\*|\[|\]|\{|\}|\?|!|\^)/gim

/**
 * Holds registered functions and builds the matching regex for a *single*
 * compiler instance. Unlike the original `Compiler.Functions` /
 * `Compiler.Regex` static fields, this is not shared global state — you can
 * have multiple independent registries (e.g. per-bot, per-test) in the same
 * process without them interfering with each other.
 */
export class FunctionRegistry {
    private readonly byName = new Map<string, IRawFunction>()
    private cachedRegex: RegExp | null = null

    public register(fns: IRawFunction[]): this {
        for (const fn of fns) {
            this.byName.set(fn.name.toLowerCase(), fn)
            for (const alias of fn.aliases ?? []) {
                if (typeof alias === "string") this.byName.set(alias.toLowerCase(), fn)
            }
        }
        this.cachedRegex = null // invalidate cache
        return this
    }

    public resolve(name: string): IRawFunction | undefined {
        const key = `$${name.toLowerCase()}`
        const direct = this.byName.get(key)
        if (direct) return direct

        for (const fn of this.byName.values()) {
            if (fn.aliases?.some((a) => a.toLowerCase() === key)) return fn
        }
        return undefined
    }

    public get regex(): RegExp {
        if (!this.cachedRegex) this.cachedRegex = this.buildRegex()
        return this.cachedRegex
    }

    private buildRegex(): RegExp {
        const names = Array.from(this.byName.keys())
            .map((name) => (name.startsWith("$") ? name.slice(1) : name))
            .map((name) => name.replace(ESCAPE_REGEX, "\\$1"))
            .sort((a, b) => b.length - a.length) // longest-first avoids prefix shadowing

        return new RegExp(`\\$(\\!)?(\\#)?(@\\[(.*?)\\])?(${names.join("|")})`, "gim")
    }
}
