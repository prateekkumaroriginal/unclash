import { ChannelType, MemberRole } from "@prisma/client";
import { z } from "zod";

export const serverCreationProps = z.object({
    name: z.string().min(4, {
        message: "Server name must be of atleast 4 characters!"
    }).max(256, {
        message: "Server name can be of maximum 256 characters!"
    }),
    imageUrl: z.string().url("ImageUrl should be a url!")
});

export const roleChangeProps = z.object({
    role: z.enum([MemberRole.GUEST, MemberRole.MODERATOR], {
        message: "Assignable roles are GUEST and MODERATOR"
    })
});

export const channelCreationProps = z.object({
    name: z.string().min(4, {
        message: "Channel name must be of atleast 4 characters!"
    }).max(256, {
        message: "Channel name can be of maximum 256 characters!"
    }).refine(
        name => name !== "general", {
        message: "Channel name cannot be 'general'"
    }),
    type: z.nativeEnum(ChannelType, {
        message: "Available channel types are TEXT, AUDIO and VIDEO"
    })
});