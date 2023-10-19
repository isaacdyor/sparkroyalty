import { z } from "zod";
import {
  activeProcedure,
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";
import { AccountType, NotificationClass } from "@prisma/client";
import { pusherServer } from "~/server/pusher";
import { toPusherKey } from "~/utils/helperFunctions";
import type { NotificationType } from "~/types/types";
import { nanoid } from "nanoid";

export const notificationsRouter = createTRPCRouter({
  getCurrent: activeProcedure.query(async ({ ctx }) => {
    const notifications = await ctx.prisma.notification.findMany({
      where: {
        investorId:
          ctx.unsafeMetadata.active === AccountType.INVESTOR
            ? ctx.userId
            : undefined,
        founderId:
          ctx.unsafeMetadata.active === AccountType.FOUNDER
            ? ctx.userId
            : undefined,
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
        investorId: z.optional(z.string()),
        founderId: z.optional(z.string()),
        notificationClass: z.nativeEnum(NotificationClass),
        link: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let connectField;
      if (input.founderId) {
        connectField = { founder: { connect: { id: input.founderId } } };
      } else if (input.investorId) {
        connectField = { investor: { connect: { id: input.investorId } } };
      }
      const notification = await ctx.prisma.notification.create({
        data: {
          subject: input.subject,
          content: input.content,
          read: false,
          deleted: false,
          notificationClass: input.notificationClass,
          link: input.link ? input.link : null,
          ...connectField,
        },
      });

      const data: NotificationType = {
        id: nanoid(),
        createdAt: new Date(),
        subject: input.subject,
        content: input.content,
        read: false,
        deleted: false,
        notificationClass: input.notificationClass,
        link: input.link ? input.link : undefined,
      };

      if (input.investorId) {
        const investorData = {
          ...data,
          investorId: input.investorId,
        };
        await pusherServer.trigger(
          toPusherKey(`investor:${input.investorId}`),
          "new-notification",
          investorData
        );
      } else if (input.founderId) {
        const founderData = {
          ...data,
          founderData: input.founderId,
        };
        await pusherServer.trigger(
          toPusherKey(`founder:${input.founderId}`),
          "new-notification",
          founderData
        );
      }

      return notification;
    }),

  delete: activeProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.notification.update({
        where: {
          id: input.notificationId,
        },
        data: {
          deleted: true,
        },
      });

      return user;
    }),
  markRead: activeProcedure
    .input(
      z.object({
        notificationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.notification.update({
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
