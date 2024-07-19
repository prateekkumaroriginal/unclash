import { z } from "zod";

export const serverCreationProps = z.object({
    name: z.string().min(4, {
        message: "Server name must be of atleast 4 characters!"
    }).max(256, {
        message: "Server name can be of maximum 256 characters!"
    }),
    imageUrl: z.string().url("ImageUrl should be a url!")
});