import { z } from "zod";
import { count, desc, eq, gte, ilike, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "./_core/trpc";
import { db } from "./db";
import { users } from "../drizzle/schema";

export const adminRouter = router({
  me: adminProcedure.query(({ ctx }) => ({
    id: ctx.user.id,
    name: ctx.user.name,
    email: ctx.user.email,
    role: ctx.user.role,
  })),

  overview: adminProcedure.query(async () => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [[totalRow], [adminRow], [recentRow]] = await Promise.all([
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(users).where(eq(users.role, "admin")),
      db.select({ value: count() }).from(users).where(gte(users.createdAt, sevenDaysAgo)),
    ]);

    return {
      totalUsers: Number(totalRow?.value ?? 0),
      adminUsers: Number(adminRow?.value ?? 0),
      newUsersLast7Days: Number(recentRow?.value ?? 0),
    };
  }),

  listUsers: adminProcedure
    .input(
      z
        .object({
          search: z.string().trim().optional(),
          limit: z.number().int().min(1).max(100).default(50),
        })
        .default({ limit: 50 })
    )
    .query(async ({ input }) => {
      const search = input.search?.trim();
      const baseQuery = db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          role: users.role,
          createdAt: users.createdAt,
          lastSignedIn: users.lastSignedIn,
        })
        .from(users);

      const rows = search
        ? await baseQuery
            .where(or(ilike(users.name, `%${search}%`), ilike(users.email, `%${search}%`)))
            .orderBy(desc(users.createdAt))
            .limit(input.limit)
        : await baseQuery.orderBy(desc(users.createdAt)).limit(input.limit);

      return rows;
    }),

  setUserRole: adminProcedure
    .input(
      z.object({
        userId: z.number().int().positive(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot change your own role",
        });
      }

      const [updated] = await db
        .update(users)
        .set({
          role: input.role,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.userId))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          updatedAt: users.updatedAt,
        });

      if (!updated) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return updated;
    }),
});
