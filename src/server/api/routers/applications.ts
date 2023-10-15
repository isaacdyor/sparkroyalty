import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  investorProcedure,
} from "~/server/api/trpc";
import { ApplicationStatusType } from "@prisma/client";

export const applicationsRouter = createTRPCRouter({
  getByInvestmentId: publicProcedure
    .input(z.object({ investmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const applications = await ctx.prisma.application.findMany({
        where: { investmentId: input.investmentId },
      });
      return applications;
    }),
  getByInvestorId: investorProcedure.query(async ({ ctx }) => {
    const applications = await ctx.prisma.application.findMany({
      where: {
        investorId: ctx.userId,
      },
      include: {
        investor: true,
        investment: true,
      },
    });
    return applications;
  }),
  getByApplicationId: publicProcedure
    .input(z.object({ applicationId: z.string() }))
    .query(async ({ ctx, input }) => {
      const applications = await ctx.prisma.application.findUnique({
        where: {
          id: input.applicationId,
        },
        include: {
          investment: {
            include: {
              applications: true,
            },
          },
          investor: true,
        },
      });
      return applications;
    }),
  checkAlreadyExists: investorProcedure
    .input(
      z.object({
        investmentId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const application = await ctx.prisma.application.findFirst({
        where: {
          investmentId: input.investmentId,
          investorId: ctx.userId!,
        },
      });
      return application;
    }),
  create: investorProcedure
    .input(
      z.object({
        projectInterest: z.string(),
        projectSkills: z.string(),
        investmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.application.create({
        data: {
          projectInterest: input.projectInterest,
          projectSkills: input.projectSkills,
          status: "PENDING",
          investment: {
            connect: { id: input.investmentId },
          },
          investor: {
            connect: { id: ctx.userId! },
          },
        },
      });

      return user;
    }),

  setStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(ApplicationStatusType),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.application.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });

      return user;
    }),
  update: publicProcedure
    .input(
      z.object({
        applicationId: z.string(),
        projectInterest: z.string(),
        projectSkills: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.application.update({
        where: {
          id: input.applicationId,
        },
        data: {
          projectInterest: input.projectInterest,
          projectSkills: input.projectSkills,
        },
      });

      return user;
    }),
  delete: publicProcedure
    .input(
      z.object({
        applicationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.application.delete({
        where: {
          id: input.applicationId,
        },
      });

      return user;
    }),
  deleteByInvestmentId: publicProcedure
    .input(
      z.object({
        investmentId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.application.deleteMany({
        where: {
          investmentId: input.investmentId,
        },
      });

      return user;
    }),
});
