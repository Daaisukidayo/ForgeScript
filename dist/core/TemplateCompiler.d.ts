import { OperatorType, WrappedCode, WrappedConditionCode } from "./types";
/**
 * Everything related to turning a parsed field's raw text into an
 * executable `WrappedCode` lives here, separate from parsing. If you
 * ever want to swap `new Function` for a safer/faster template
 * evaluator (e.g. a tokenized substitution array instead of eval'd
 * JS), this is the only file that needs to change.
 */
export declare class TemplateCompiler {
    wrap(code: string): WrappedCode;
    wrapCondition(op: OperatorType): WrappedConditionCode;
}
//# sourceMappingURL=TemplateCompiler.d.ts.map