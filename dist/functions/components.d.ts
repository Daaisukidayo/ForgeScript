import { ActionRowBuilder, ButtonBuilder, ChannelSelectMenuBuilder, ComponentType, ContainerBuilder, FileBuilder, MediaGalleryBuilder, MentionableSelectMenuBuilder, MessageActionRowComponentBuilder, RoleSelectMenuBuilder, SectionBuilder, SeparatorBuilder, StringSelectMenuBuilder, TextDisplayBuilder, TextInputBuilder, UserSelectMenuBuilder } from "discord.js";
import { Context } from "../structures";
/**
 * Checks whether the specified component type is a top level component.
 * @param type The component type.
 * @param actionRow Whether to include action rows when checking. Defaults to `true`.
 * @returns
 */
export declare function isTopLevel(type: ComponentType, actionRow?: boolean): boolean;
/**
 * Builds a message component for action rows.
 * @param comp The component data.
 * @returns
 */
export declare function buildActionRow(comp: any): ButtonBuilder | StringSelectMenuBuilder | UserSelectMenuBuilder | ChannelSelectMenuBuilder | RoleSelectMenuBuilder | MentionableSelectMenuBuilder;
/**
 * Builds a top level component.
 * @param comp The component data.
 * @param ctx The current context, if any.
 * @returns
 */
export declare function buildComponent(comp: any, ctx?: Context): ContainerBuilder | FileBuilder | MediaGalleryBuilder | SectionBuilder | SeparatorBuilder | TextDisplayBuilder | ActionRowBuilder<import("@discordjs/builders").AnyComponentBuilder>;
/**
 * Gets the last component of the current label or action row.
 * @param ctx The current context.
 * @returns
 */
export declare function getLastComponent(ctx: Context): MessageActionRowComponentBuilder | TextInputBuilder | undefined;
/**
 * Adds an action row to the components. This is mostly needed inside ComponentsV2 functions.
 * @param ctx The current context.
 * @param cv2 Whether to set the IsComponentsV2 flag. Defaults to `true`.
 * @returns
 */
export declare function addActionRow(ctx: Context, cv2?: boolean): void;
//# sourceMappingURL=components.d.ts.map