/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { OperatorType, WrappedConditionCode } from "./types"

export const Conditions: Record<OperatorType, WrappedConditionCode> = {
    [OperatorType.None]: (lhs) => lhs === "true",
    [OperatorType.NotEq]: (lhs, rhs) => lhs !== rhs,
    [OperatorType.Eq]: (lhs, rhs) => lhs === rhs,
    [OperatorType.Lt]: (lhs, rhs) => Number(lhs) < Number(rhs),
    [OperatorType.Lte]: (lhs, rhs) => Number(lhs) <= Number(rhs),
    [OperatorType.Gt]: (lhs, rhs) => Number(lhs) > Number(rhs),
    [OperatorType.Gte]: (lhs, rhs) => Number(lhs) >= Number(rhs),
}
