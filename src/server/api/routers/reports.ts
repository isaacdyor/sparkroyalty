import { z } from "zod";
import {
  createTRPCRouter,
  founderProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reportsRouter = createTRPCRouter({
  create: founderProcedure
    .input(
      z.object({
        investmentId: z.string(),
        earnings: z.number(),
        progress: z.string(),
        plans: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.report.create({
        data: {
          earnings: input.earnings,
          progress: input.progress,
          plans: input.plans,
          investment: {
            connect: {
              id: input.investmentId,
            },
          },
        },
      });

      return user;
    }),
  getByInvestmentId: publicProcedure
    .input(z.object({ investmentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const founder = await ctx.prisma.report.findMany({
        where: { investmentId: input.investmentId },
      });
      return founder;
    }),
  getOne: publicProcedure
    .input(z.object({ reportId: z.string() }))
    .query(async ({ ctx, input }) => {
      const founder = await ctx.prisma.report.findUnique({
        where: { id: input.reportId },
      });
      return founder;
    }),
});
