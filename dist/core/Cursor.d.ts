import { ILocation } from "./types";
/**
 * All position-tracking that used to live directly on `Compiler`
 * (index, char, peek, back, skip, moveTo, locate) now lives here.
 * This is reusable by any future parser (linter, formatter, etc.)
 * and is trivially unit-testable on its own.
 */
export declare class Cursor {
    private readonly source;
    private index;
    private readonly newlineOffsets;
    constructor(source: string);
    get position(): number;
    char(): string | undefined;
    peek(offset?: number): string | undefined;
    back(): string | undefined;
    advance(): string | undefined;
    skip(n: number): void;
    moveTo(index: number): void;
    sliceFrom(index: number): string;
    /** Raw source substring between two positions — used to preserve the
     *  literal, unprocessed text of a field (e.g. for `$escapeCode`). */
    slice(start: number, end: number): string;
    locate(index?: number): ILocation;
}
//# sourceMappingURL=Cursor.d.ts.map