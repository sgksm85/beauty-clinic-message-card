import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { randomUUID } from "crypto";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Card routes (public - no auth required)
  cards: router({
    create: publicProcedure
      .input(
        z.object({
          templateId: z.string().min(1),
          message: z.string().min(1).max(200),
          senderName: z.string().max(100).optional(),
        }),
      )
      .mutation(async ({ input }) => {
        const id = randomUUID();
        await db.createCard({
          id,
          templateId: input.templateId,
          message: input.message,
          senderName: input.senderName || null,
          isActive: 1,
        });
        return { id };
      }),

    getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
      const card = await db.getActiveCardById(input.id);
      if (!card) {
        throw new Error("Card not found or inactive");
      }
      return card;
    }),
  }),
});

export type AppRouter = typeof appRouter;
