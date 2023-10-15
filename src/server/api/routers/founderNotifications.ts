import { z } from "zod";
import {
  createTRPCRouter,
  founderProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const NotificationType = z.enum([
  "NEW_REVIEW",
  "JOB_COMPLETE",
  "NEW_APPLICATION",
]);

export const founderNotificationsRouter = createTRPCRouter({
  getCurrent: founderProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.founderNotification.findMany({
      where: {
        founderId: ctx.userId!,
        deleted: false,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return notifications;
  }),

  create: publicProcedure
    .input(
      z.object({
        subject: z.string(),
        content: z.string(),
        founderId: z.string(),
        notificationType: NotificationType,
        link: z.union([z.string(), z.undefined()]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.founderNotification.create({
        data: {
          subject: input.subject,
          content: input.content,
          read: false,
          deleted: false,
          type: input.notificationType,
          founder: {
            connect: { id: input.founderId },
          },
          link: input.link ? input.link : undefined,
        },
      });

      return user;
    }),
  delete: founderProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.founderNotification.update({
        where: {
          id: input.notificationId,
        },
        data: {
          deleted: true,
        },
      });

      return user;
    }),
  markRead: founderProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.founderNotification.update({
        where: {
          id: input.notificationId,
        },
        data: {
          read: true,
        },
      });

      return user;
    }),
});
