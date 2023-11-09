import { z } from "zod";
import { activeProcedure, createTRPCRouter } from "~/server/api/trpc";
import { pusherServer } from "~/utils/pusher";
import { AccountType } from "@prisma/client";
import { ActiveType } from "~/types/types";
import { toPusherKey } from "~/utils/helperFunctions";
import { nanoid } from "nanoid";

export const messagesRouter = createTRPCRouter({
  createConversation: activeProcedure
    .input(
      z.object({
        content: z.string(),
        recipientId: z.string(),
        senderName: z.string(),
        senderImageUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const data = {
        messages: {},
        founder: {},
        investor: {},
      };

      if (ctx.unsafeMetadata.active === ActiveType.INVESTOR) {
        data.messages = {
          create: {
            content: input.content,
            founder: {
              connect: { id: input.recipientId },
            },
            investor: {
              connect: { id: ctx.userId },
            },
            senderType: AccountType.INVESTOR,
          },
        };
        data.founder = {
          connect: { id: input.recipientId },
        };
        data.investor = {
          connect: { id: ctx.userId },
        };
      } else {
        data.messages = {
          create: {
            content: input.content,
            founder: {
              connect: { id: ctx.userId },
            },
            investor: {
              connect: { id: input.recipientId },
            },
            senderType: AccountType.FOUNDER,
          },
        };
        data.founder = {
          connect: { id: ctx.userId },
        };
        data.investor = {
          connect: { id: input.recipientId },
        };
      }

      const user = await ctx.prisma.conversation.create({
        data,
      });

      if (ctx.unsafeMetadata.active === ActiveType.INVESTOR) {
        await pusherServer.trigger(
          toPusherKey(`founder:${input.recipientId}`),
          "new-conversation",
          {
            id: nanoid(),
            createdAt: new Date(),
            lastMessageAt: new Date(),
            founderSeen: false,
            investorSeen: true,
            founderId: input.recipientId,
            investorId: ctx.userId,
            investorName: input.senderName,
            investorImageUrl: input.senderImageUrl,

            messages: [
              {
                content: input.content,
                createdAt: new Date(),
                id: nanoid(),
                senderType: AccountType.INVESTOR,
                investorId: ctx.userId,
                founderId: input.recipientId,
              },
            ],
          }
        );
      } else if (ctx.unsafeMetadata.active === AccountType.FOUNDER) {
        await pusherServer.trigger(
          toPusherKey(`investor:${input.recipientId}`),
          "new-conversation",
          {
            id: nanoid(),
            createdAt: new Date(),
            lastMessageAt: new Date(),
            founderSeen: true,
            investorSeen: false,
            founderId: ctx.userId,
            investorId: input.recipientId,
            founderName: input.senderName,
            founderImageUrl: input.senderImageUrl,

            messages: [
              {
                content: input.content,
                id: nanoid(),
                createdAt: new Date(),
                senderType: AccountType.FOUNDER,
                investorId: input.recipientId,
                founderId: ctx.userId,
              },
            ],
          }
        );
      }

      return user;
    }),
  sendMessage: activeProcedure
    .input(
      z.object({
        content: z.string(),
        conversation: z.object({
          id: z.string(),
          founderId: z.string(),
          investorId: z.string(),
        }),
        recipientId: z.string(),
        imageUrl: z.string(),
        senderName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("bang");
      interface Message {
        content: string;
        founder: {
          connect: {
            id: string;
          };
        };
        investor: {
          connect: {
            id: string;
          };
        };
        conversation: {
          connect: {
            id: string;
          };
        };
        senderType: AccountType;
      }
      let data: Message;

      if (ctx.unsafeMetadata.active === ActiveType.INVESTOR) {
        data = {
          content: input.content,
          founder: {
            connect: { id: input.recipientId },
          },
          investor: {
            connect: { id: ctx.userId },
          },
          conversation: {
            connect: { id: input.conversation.id },
          },
          senderType: AccountType.INVESTOR,
        };
      } else {
        data = {
          content: input.content,
          founder: {
            connect: { id: ctx.userId },
          },
          investor: {
            connect: { id: input.recipientId },
          },
          conversation: {
            connect: { id: input.conversation.id },
          },
          senderType: AccountType.FOUNDER,
        };
      }

      const user = await ctx.prisma.message.create({
        data,
      });

      await ctx.prisma.conversation.update({
        where: {
          id: input.conversation.id,
        },
        data: {
          lastMessageAt: new Date(),
        },
      });

      if (ctx.unsafeMetadata.active === ActiveType.INVESTOR) {
        await pusherServer.trigger(
          toPusherKey(`founder:${input.conversation.founderId}`),
          "new-message",
          {
            content: input.content,
            id: nanoid(),
            senderType: AccountType.INVESTOR,
            conversationId: input.conversation.id,
            imageUrl: input.imageUrl,
            senderName: input.senderName,
          }
        );
      } else if (ctx.unsafeMetadata.active === AccountType.FOUNDER) {
        await pusherServer.trigger(
          toPusherKey(`investor:${input.conversation.investorId}`),
          "new-message",
          {
            content: input.content,
            id: nanoid(),
            senderType: AccountType.FOUNDER,
            conversationId: input.conversation.id,
            imageUrl: input.imageUrl,
            senderName: input.senderName,
          }
        );
      }

      return user;
    }),
  getConversations: activeProcedure.query(async ({ ctx }) => {
    let condition = {};
    if (ctx.unsafeMetadata.active === ActiveType.INVESTOR) {
      condition = {
        investorId: ctx.userId,
      };
    } else {
      condition = {
        founderId: ctx.userId,
      };
    }
    const conversation = await ctx.prisma.conversation.findMany({
      where: condition,
      include: {
        founder: true,
        investor: true,
        messages: true,
      },
    });
    return conversation;
  }),
  getUnreadConversations: activeProcedure.query(async ({ ctx }) => {
    let condition = {};
    if (ctx.unsafeMetadata.active === ActiveType.INVESTOR) {
      condition = {
        investorId: ctx.userId,
        investorSeen: false,
      };
    } else {
      condition = {
        founderId: ctx.userId,
        founderSeen: false,
      };
    }
    const conversation = await ctx.prisma.conversation.findMany({
      where: condition,
      include: {
        founder: true,
        investor: true,
        messages: true,
      },
    });
    return conversation;
  }),
  markRead: activeProcedure
    .input(
      z.object({
        conversationId: z.string(),
        accountType: z.nativeEnum(AccountType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let data = {};
      if (input.accountType === AccountType.INVESTOR) {
        data = {
          investorSeen: true,
        };
      } else {
        data = {
          founderSeen: true,
        };
      }
      const user = await ctx.prisma.conversation.update({
        where: {
          id: input.conversationId,
        },
        data,
      });

      return user;
    }),
  markNotRead: activeProcedure
    .input(
      z.object({
        conversationId: z.string(),
        accountType: z.nativeEnum(AccountType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      let data = {};
      if (input.accountType === AccountType.INVESTOR) {
        data = {
          investorSeen: false,
        };
      } else {
        data = {
          founderSeen: false,
        };
      }
      const user = await ctx.prisma.conversation.update({
        where: {
          id: input.conversationId,
        },
        data,
      });

      return user;
    }),
});
