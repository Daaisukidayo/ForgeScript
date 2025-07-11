import { ArgType, NativeFunction, Return } from "../../structures"

export default new NativeFunction({
    name: "$editRoleIcon",
    version: "1.0.7",
    description: "Edits a role's icon, returns boolean",
    unwrap: true,
    brackets: true,
    output: ArgType.Boolean,
    args: [
        {
            name: "guild ID",
            description: "The guild to pull the role from",
            rest: false,
            required: true,
            type: ArgType.Guild,
        },
        {
            name: "role ID",
            pointer: 0,
            type: ArgType.Role,
            description: "The role to edit icon for",
            rest: false,
            required: true,
        },
        {
            name: "icon",
            description: "The new icon for the role, omit to clear",
            rest: false,
            type: ArgType.String,
        },
    ],
    async execute(ctx, [, role, url]) {
        return this.success(!!(await role.setIcon(url).catch(ctx.noop)))
    },
})
