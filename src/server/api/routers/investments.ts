import { z } from "zod";
import {
  createTRPCRouter,
  founderProcedure,
  investorProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { PaymentBasisType, FrequencyType } from "@prisma/client";

export const investmentsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const investments = await ctx.prisma.investment.findMany({
      include: {
        founder: true,
      },
    });
    return investments;
  }),
  getPending: publicProcedure.query(async ({ ctx }) => {
    const investments = await ctx.prisma.investment.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        skills: true,
        founder: true,
        applications: true,
      },
    });
    return investments;
  }),
  getByInvestmentId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const investment = await ctx.prisma.investment.findUnique({
        where: { id: input.id },
        include: {
          skills: true,
          investor: {
            include: {
              reviews: {
                where: {
                  revieweeType: "INVESTOR",
                },
              },
              investments: true,
            },
          },
          founder: {
            include: {
              reviews: {
                where: {
                  revieweeType: "FOUNDER",
                },
              },
              investments: true,
            },
          },
          reports: true,
          applications: {
            include: {
              investor: {
                include: {
                  skills: true,
                },
              },
            },
          },
        },
      });
      return investment;
    }),
  getByFounderId: publicProcedure
    .input(z.object({ founderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const investments = await ctx.prisma.investment.findMany({
        where: { founderId: input.founderId },
      });
      return investments;
    }),
  getByInvestorId: publicProcedure
    .input(z.object({ investorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const investments = await ctx.prisma.investment.findMany({
        where: {
          investorId: input.investorId,
          status: "BUILDING",
        },
        include: {
          founder: true,
          investor: true,
        },
      });
      return investments;
    }),
  getJobs: investorProcedure.query(async ({ ctx }) => {
    const investments = await ctx.prisma.investment.findMany({
      where: {
        investorId: ctx.userId,
        status: {
          in: ["BUILDING", "PAYOUT", "COMPLETED"],
        },
      },
      include: {
        founder: true,
        investor: true,
        skills: true,
      },
    });
    return investments;
  }),
  create: founderProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        workType: z.string(),
        workDescription: z.string(),
        skills: z.array(z.string()),
        paymentBasis: z.nativeEnum(PaymentBasisType),
        percent: z.number(),
        totalPayout: z.number(),
        payoutFrequency: z.nativeEnum(FrequencyType),
        extraDetails: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investment.create({
        data: {
          title: input.title,
          description: input.description,
          workType: input.workType,
          workDescription: input.workDescription,
          skills: {
            create: input.skills.map((skill) => ({
              skill,
            })),
          },
          paymentBasis: input.paymentBasis,
          percent: input.percent,
          totalPayout: input.totalPayout,
          payoutFrequency: input.payoutFrequency,
          extraDetails: input.extraDetails,
          status: "PENDING",
          founder: {
            connect: { id: ctx.userId },
          },
        },
      });

      return user;
    }),
  acceptApplication: publicProcedure
    .input(
      z.object({
        investmentId: z.string(),
        investorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investment.update({
        where: {
          id: input.investmentId,
        },
        data: {
          status: "BUILDING",
          investor: {
            connect: { id: input.investorId },
          },
        },
      });

      return user;
    }),
  completeJob: publicProcedure
    .input(
      z.object({
        investmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investment.update({
        where: {
          id: input.investmentId,
        },
        data: {
          status: "PAYOUT",
        },
      });

      return user;
    }),
  updatePayout: publicProcedure
    .input(
      z.object({
        investmentId: z.string(),
        payout: z.number(),
        completed: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investment.update({
        where: {
          id: input.investmentId,
        },
        data: {
          currentPayout: {
            increment: input.payout,
          },
          status: input.completed ? "COMPLETED" : "PAYOUT",
        },
      });

      return user;
    }),
  relationshipExistsFounder: investorProcedure
    .input(
      z.object({
        founderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const investment = await ctx.prisma.investment.findFirst({
        where: {
          founderId: input.founderId,
          investorId: ctx.userId,
          status: {
            in: ["PAYOUT", "COMPLETED"],
          },
        },
      });
      return investment;
    }),
  relationshipExistsInvestor: founderProcedure
    .input(
      z.object({
        investorId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const investment = await ctx.prisma.investment.findFirst({
        where: {
          founderId: ctx.userId!,
          investorId: input.investorId,
          status: {
            in: ["PAYOUT", "COMPLETED"],
          },
        },
      });
      return investment;
    }),
  update: founderProcedure
    .input(
      z.object({
        investmentId: z.string(),
        title: z.string(),
        description: z.string(),
        workType: z.string(),
        workDescription: z.string(),
        skills: z.array(z.string()),
        paymentBasis: z.nativeEnum(PaymentBasisType),
        percent: z.number(),
        totalPayout: z.number(),
        payoutFrequency: z.nativeEnum(FrequencyType),
        extraDetails: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investment.update({
        where: {
          id: input.investmentId,
        },
        data: {
          title: input.title,
          description: input.description,
          workType: input.workType,
          workDescription: input.workDescription,
          skills: {
            deleteMany: {},
            create: input.skills.map((skill) => ({
              skill,
            })),
          },
          paymentBasis: input.paymentBasis,
          percent: input.percent,
          totalPayout: input.totalPayout,
          payoutFrequency: input.payoutFrequency,

          extraDetails: input.extraDetails,
        },
      });

      return user;
    }),
  delete: publicProcedure
    .input(
      z.object({
        investmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investment.delete({
        where: {
          id: input.investmentId,
        },
      });

      return user;
    }),
});
