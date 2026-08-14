"use strict";
/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = void 0;
/**
 * All position-tracking that used to live directly on `Compiler`
 * (index, char, peek, back, skip, moveTo, locate) now lives here.
 * This is reusable by any future parser (linter, formatter, etc.)
 * and is trivially unit-testable on its own.
 */
class Cursor {
    source;
    index = 0;
    // Precomputed newline offsets so `locate()` is O(log n) instead of
    // O(n) per call (the original re-scanned from 0 on every error).
    newlineOffsets;
    constructor(source) {
        this.source = source;
        this.newlineOffsets = [];
        for (let i = 0; i < source.length; i++) {
            if (source[i] === "\n")
                this.newlineOffsets.push(i);
        }
    }
    get position() {
        return this.index;
    }
    char() {
        return this.source[this.index];
    }
    peek(offset = 1) {
        return this.source[this.index + offset];
    }
    back() {
        return this.source[this.index - 1];
    }
    advance() {
        return this.source[this.index++];
    }
    skip(n) {
        this.index += n;
    }
    moveTo(index) {
        this.index = index;
    }
    sliceFrom(index) {
        return this.source.slice(index);
    }
    /** Raw source substring between two positions — used to preserve the
     *  literal, unprocessed text of a field (e.g. for `$escapeCode`). */
    slice(start, end) {
        return this.source.slice(start, end);
    }
    locate(index = this.index) {
        // Binary search for the last newline before `index`.
        let lo = 0;
        let hi = this.newlineOffsets.length;
        while (lo < hi) {
            const mid = (lo + hi) >> 1;
            if (this.newlineOffsets[mid] < index)
                lo = mid + 1;
            else
                hi = mid;
        }
        const line = lo + 1;
        const lineStart = lo === 0 ? -1 : this.newlineOffsets[lo - 1];
        return { line, column: index - lineStart - 1 };
    }
}
exports.Cursor = Cursor;
//# sourceMappingURL=Cursor.js.map