import { z } from "zod";
import {
  createTRPCRouter,
  investorProcedure,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { ExperienceLevelType } from "@prisma/client";

const SkillInputSchema = z.object({
  skill: z.string(),
  experience: z.nativeEnum(ExperienceLevelType),
});

export const investorRouter = createTRPCRouter({
  create: privateProcedure
    .input(
      z.object({
        fullName: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string(),
        title: z.string(),
        imageUrl: z.string(),
        bio: z.string(),
        skills: z.array(SkillInputSchema),
        country: z.string(),
        educationAndExperience: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.investor.create({
        data: {
          id: ctx.userId,
          fullName: input.fullName,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          imageUrl: input.imageUrl,
          title: input.title,
          bio: input.bio,
          skills: {
            create: input.skills.map((skill) => ({
              skill: skill.skill,
              experience: skill.experience,
            })),
          },
          country: input.country,
          educationAndExperience: input.educationAndExperience,
        },
      });

      return user;
    }),
  getOne: publicProcedure
    .input(z.object({ investorId: z.string() }))
    .query(async ({ ctx, input }) => {
      const investor = await ctx.prisma.investor.findUnique({
        where: { id: input.investorId },
        include: {
          skills: true,
          reviews: {
            where: {
              revieweeType: "INVESTOR",
            },
          },
          investments: {
            include: {
              founder: true,
            },
          },
        },
      });
      return investor;
    }),
  getCurrent: privateProcedure.query(async ({ ctx }) => {
    const investor = await ctx.prisma.investor.findUnique({
      where: { id: ctx.userId! },
      include: {
        skills: true,
        reviews: {
          where: {
            revieweeType: "INVESTOR",
          },
        },
        investments: {
          include: {
            founder: true,
          },
        },
      },
    });
    return investor;
  }),
  getAll: privateProcedure.query(async ({ ctx }) => {
    const investor = await ctx.prisma.investor.findMany();
    return investor;
  }),
  update: investorProcedure
    .input(
      z.object({
        fullName: z.string(),
        firstName: z.string(),
        lastName: z.string(),
        title: z.string(),
        bio: z.string(),
        skills: z.array(SkillInputSchema),
        country: z.string(),
        educationAndExperience: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const investor = await ctx.prisma.investor.update({
        where: {
          id: ctx.userId,
        },
        data: {
          fullName: input.fullName,
          firstName: input.firstName,
          lastName: input.lastName,
          title: input.title,
          bio: input.bio,
          skills: {
            deleteMany: {},
            create: input.skills.map((skill) => ({
              skill: skill.skill,
              experience: skill.experience,
            })),
          },
          country: input.country,
          educationAndExperience: input.educationAndExperience,
        },
      });

      return investor;
    }),
  delete: investorProcedure.mutation(async ({ ctx }) => {
    const investor = await ctx.prisma.investor.delete({
      where: {
        id: ctx.userId,
      },
    });

    return investor;
  }),
});
