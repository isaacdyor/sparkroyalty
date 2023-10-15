import { z } from "zod";
import {
  createTRPCRouter,
  investorProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { InvestorNotificationType } from "@prisma/client";

export const investorNotificationsRouter = createTRPCRouter({
  getCurrent: investorProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.investorNotification.findMany({
      where: {
        investorId: ctx.userId,
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
        investorId: z.string(),
        notificationType: z.nativeEnum(InvestorNotificationType),
        link: z.union([z.string(), z.undefined()]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.prisma.investorNotification.create({
        data: {
          subject: input.subject,
          content: input.content,
          read: false,
          deleted: false,
          type: input.notificationType,
          investor: {
            connect: { id: input.investorId },
          },
          link: input.link ? input.link : undefined,
        },
      });

      return notification;
    }),

  delete: investorProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investorNotification.update({
        where: {
          id: input.notificationId,
        },
        data: {
          deleted: true,
        },
      });

      return user;
    }),
  markRead: investorProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investorNotification.update({
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
