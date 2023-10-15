import { z } from "zod";
import {
  createTRPCRouter,
  founderProcedure,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const founderRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        fullName: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        imaegeUrl: z.string(),
        bio: z.string(),
        country: z.string(),
        educationAndExperience: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.founder.create({
        data: {
          id: ctx.userId,
          fullName: input.fullName,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          imageUrl: input.imaegeUrl,
          bio: input.bio,
          country: input.country,
          educationAndExperience: input.educationAndExperience,
        },
      });

      return user;
    }),
  getOne: publicProcedure
    .input(z.object({ founderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const founder = await ctx.prisma.founder.findUnique({
        where: { id: input.founderId },
        include: {
          investments: true,
          reviews: {
            where: {
              revieweeType: "FOUNDER",
            },
          },
        },
      });
      return founder;
    }),
  getCurrent: privateProcedure.query(async ({ ctx }) => {
    const founder = await ctx.prisma.founder.findUnique({
      where: { id: ctx.userId! },
      include: {
        investments: {
          include: {
            skills: true,
          },
        },
        reviews: {
          where: {
            revieweeType: "FOUNDER",
          },
        },
      },
    });
    return founder;
  }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    const founder = await ctx.prisma.founder.findMany();
    return founder;
  }),
  update: founderProcedure
    .input(
      z.object({
        fullName: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        bio: z.string(),
        country: z.string(),
        educationAndExperience: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const founder = await ctx.prisma.founder.update({
        where: {
          id: ctx.userId!,
        },
        data: {
          fullName: input.fullName,
          firstName: input.firstName,
          lastName: input.lastName,
          bio: input.bio,
          country: input.country,
          educationAndExperience: input.educationAndExperience,
        },
      });

      return founder;
    }),
  delete: founderProcedure.mutation(async ({ ctx }) => {
    const founder = await ctx.prisma.founder.delete({
      where: {
        id: ctx.userId,
      },
    });

    return founder;
  }),
});
