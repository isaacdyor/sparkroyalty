import { z } from "zod";
import { clerkClient } from "@clerk/nextjs/server";
import { createTRPCRouter, privateProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  updateName: privateProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("mutating");
      const name = await clerkClient.users.updateUser(ctx.userId, {
        firstName: input.firstName,
        lastName: input.lastName,
      });
      return name;
    }),
});
