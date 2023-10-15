import { investmentsRouter } from "~/server/api/routers/investments";
import { investorRouter } from "./routers/investors";
import { founderRouter } from "./routers/founders";
import { createTRPCRouter } from "~/server/api/trpc";
import { applicationsRouter } from "./routers/applications";
import { reviewsRouter } from "./routers/reviews";
import { investorNotificationsRouter } from "./routers/investorNotifications";
import { founderNotificationsRouter } from "./routers/founderNotifications";
import { usersRouter } from "./routers/users";
import { reportsRouter } from "./routers/reports";
import { messagesRouter } from "./routers/messages";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be    manually added here.
 */
export const appRouter = createTRPCRouter({
  investments: investmentsRouter,
  investors: investorRouter,
  founders: founderRouter,
  applications: applicationsRouter,
  reviews: reviewsRouter,
  reports: reportsRouter,
  investorNotifications: investorNotificationsRouter,
  founderNotifications: founderNotificationsRouter,
  messages: messagesRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
