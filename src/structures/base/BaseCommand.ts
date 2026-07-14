/*
* SPDX-License-Identifier: LGPL-3.0-or-later
* Copyright © 2026 BotForge
*/

import { ClientEvents, Interaction } from "discord.js"
import { IExtendedCompilationResult, Compiler, ForgeClient } from "../../core"
import { ForgeError, ErrorType } from "../forge/ForgeError"
import { Context } from ".."

export type CommandType = keyof ClientEvents
export type RawExecutableCode = (ctx: Context) => Promise<unknown[] | null>

export type CommandInteractionTypes =
    | "button"
    | "modal"
    | "slashCommand"
    | "autocomplete"
    | "contextMenu"
    | "userContextMenu"
    | "messageContextMenu"
    | "selectMenu"
    | "userSelectMenu"
    | "roleSelectMenu"
    | "channelSelectMenu"
    | "mentionableSelectMenu"
    | "activityCommand"
    | "messageComponent"

export interface IBaseCommand<T> {
    name?: string
    type: T
    code: string
    guildOnly?: boolean
    unprefixed?: boolean
    aliases?: string[]
    allowedInteractionTypes?: CommandInteractionTypes[]
    allowBots?: boolean
    disableConsoleErrors?: boolean
    [x: PropertyKey]: unknown

    /**
     * @private Do not define
     */
    path?: string

    /**
     * @private Do not define
     */
    unloadable?: boolean
}

export interface ICompiledCommand {
    name?: IExtendedCompilationResult
    code: IExtendedCompilationResult
}

let id = 0
export class BaseCommand<T> {
    public readonly compiled: ICompiledCommand
    public readonly id = ++id

    public constructor(public readonly data: IBaseCommand<T>) {
        this.compiled = {
            name: Compiler.compile(data.name, this.data.path),
            code: Compiler.compile(data.code, this.data.path),
        }
    }

    public setPath(p: string) {
        this.data.path = p
        return this
    }

    public validate() {
        if (!this.data.type)
            throw new ForgeError(null, ErrorType.MissingCommandType, this.data.path)
    }

    public static from(code: string) {
        return new this({
            code,
            type: null
        })
    }

    public get name() {
        return this.data.name
    }

    public get type() {
        return this.data.type
    }

    public hasDisabledConsoleErrors(client: ForgeClient) {
        return this.data.disableConsoleErrors || (this.data.disableConsoleErrors === undefined && client.options.disableConsoleErrors)
    }

    public matchesInteractionType(i: Interaction) {
        return (
            !this.data.name ||
            (
                "customId" in i &&
                this.data.name === i.customId
            )
        ) && (
                !this.data.allowedInteractionTypes?.length || (
                    this.data.allowedInteractionTypes.some(
                        type =>
                            (type === "button" && i.isButton()) ||
                            (type === "modal" && i.isModalSubmit()) ||
                            (type === "slashCommand" && i.isChatInputCommand()) ||
                            (type === "autocomplete" && i.isAutocomplete()) ||
                            (type === "selectMenu" && i.isAnySelectMenu()) ||
                            (type === "userSelectMenu" && i.isUserSelectMenu()) ||
                            (type === "roleSelectMenu" && i.isRoleSelectMenu()) ||
                            (type === "channelSelectMenu" && i.isChannelSelectMenu()) ||
                            (type === "mentionableSelectMenu" && i.isMentionableSelectMenu()) ||
                            (type === "contextMenu" && i.isContextMenuCommand()) ||
                            (type === "userContextMenu" && i.isUserContextMenuCommand()) ||
                            (type === "messageContextMenu" && i.isMessageContextMenuCommand()) ||
                            (type === "activityCommand" && i.isPrimaryEntryPointCommand()) ||
                            (type === "messageComponent" && i.isMessageComponent())
                    )
                )
            )
    }
}
