import { BaseChannel } from "discord.js";
import { ArgType, NativeFunction } from "../../structures";
import { PollProperty } from "../../properties/poll";
declare const _default: NativeFunction<[{
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.Channel;
    check: (i: BaseChannel) => boolean;
}, {
    name: string;
    description: string;
    rest: false;
    required: true;
    type: ArgType.Message;
    pointer: number;
}, {
    name: string;
    description: string;
    rest: false;
    type: ArgType.Enum;
    enum: typeof PollProperty;
    required: true;
}], true>;
export default _default;
//# sourceMappingURL=getPoll.d.ts.map