/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { ILocation } from "./types"

/**
 * All position-tracking that used to live directly on `Compiler`
 * (index, char, peek, back, skip, moveTo, locate) now lives here.
 * This is reusable by any future parser (linter, formatter, etc.)
 * and is trivially unit-testable on its own.
 */
export class Cursor {
    private index = 0

    // Precomputed newline offsets so `locate()` is O(log n) instead of
    // O(n) per call (the original re-scanned from 0 on every error).
    private readonly newlineOffsets: number[]

    constructor(private readonly source: string) {
        this.newlineOffsets = []
        for (let i = 0; i < source.length; i++) {
            if (source[i] === "\n") this.newlineOffsets.push(i)
        }
    }

    public get position(): number {
        return this.index
    }

    public char(): string | undefined {
        return this.source[this.index]
    }

    public peek(offset = 1): string | undefined {
        return this.source[this.index + offset]
    }

    public back(): string | undefined {
        return this.source[this.index - 1]
    }

    public advance(): string | undefined {
        return this.source[this.index++]
    }

    public skip(n: number): void {
        this.index += n
    }

    public moveTo(index: number): void {
        this.index = index
    }

    public sliceFrom(index: number): string {
        return this.source.slice(index)
    }

    /** Raw source substring between two positions — used to preserve the
     *  literal, unprocessed text of a field (e.g. for `$escapeCode`). */
    public slice(start: number, end: number): string {
        return this.source.slice(start, end)
    }

    public locate(index = this.index): ILocation {
        // Binary search for the last newline before `index`.
        let lo = 0
        let hi = this.newlineOffsets.length
        while (lo < hi) {
            const mid = (lo + hi) >> 1
            if (this.newlineOffsets[mid] < index) lo = mid + 1
            else hi = mid
        }
        const line = lo + 1
        const lineStart = lo === 0 ? -1 : this.newlineOffsets[lo - 1]
        return { line, column: index - lineStart - 1 }
    }
}
