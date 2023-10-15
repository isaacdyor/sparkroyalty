import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import superjson from "superjson";
import { prisma } from "../db";
import { ActiveType } from "~/types/types";

export const helpers = createServerSideHelpers({
  router: appRouter,
  ctx: {
    prisma,
    userId: null,
    unsafeMetadata: {
      active: ActiveType.NONE,
      investor: false,
      founder: false,
    },
  },
  transformer: superjson,
});
