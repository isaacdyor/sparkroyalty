import { z } from "zod";
import {
  createTRPCRouter,
  founderProcedure,
  investorProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const reviewsRouter = createTRPCRouter({
  getByReviewId: publicProcedure
    .input(z.object({ reviewId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findUnique({
        where: {
          id: input.reviewId,
        },
        include: {
          founder: true,
          investor: true,
        },
      });
      return reviews;
    }),
  getByInvestorId: publicProcedure
    .input(z.object({ investorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        include: {
          founder: true,
        },
        where: {
          investorId: input.investorId,
          revieweeType: "INVESTOR",
        },
      });
      return reviews;
    }),
  getByFounderId: publicProcedure
    .input(z.object({ founderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const reviews = await ctx.prisma.review.findMany({
        where: {
          investorId: input.founderId,
          revieweeType: "FOUNDER",
        },
        include: {
          founder: true,
        },
      });
      return reviews;
    }),

  investorReviewExists: founderProcedure
    .input(
      z.object({
        investorId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          founderId: ctx.userId,
          investorId: input.investorId,
          revieweeType: "INVESTOR",
        },
      });
      return review;
    }),
  founderReviewExists: investorProcedure
    .input(
      z.object({
        founderId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.findFirst({
        where: {
          founderId: input.founderId,
          investorId: ctx.userId!,
          revieweeType: "FOUNDER",
        },
      });
      return review;
    }),

  reviewFounder: investorProcedure
    .input(
      z.object({
        review: z.string(),
        stars: z.number(),
        founderId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.review.create({
        data: {
          review: input.review,
          stars: input.stars,
          founder: {
            connect: { id: input.founderId },
          },
          investor: {
            connect: { id: ctx.userId! },
          },
          revieweeType: "FOUNDER",
        },
      });

      return user;
    }),

  reviewInvestor: founderProcedure
    .input(
      z.object({
        review: z.string(),
        stars: z.number(),
        investorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.review.create({
        data: {
          review: input.review,
          stars: input.stars,
          founder: {
            connect: { id: input.investorId },
          },
          investor: {
            connect: { id: ctx.userId! },
          },
          revieweeType: "INVESTOR",
        },
      });

      return user;
    }),

  update: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
        review: z.string(),
        stars: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.update({
        where: {
          id: input.reviewId,
        },
        data: {
          review: input.review,
          stars: input.stars,
        },
      });

      return review;
    }),
  delete: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.prisma.review.delete({
        where: {
          id: input.reviewId,
        },
      });

      return review;
    }),
});
