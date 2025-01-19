import { boolean, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Writer = pgTable("writer", {
    id: serial("id").primaryKey(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    otp: text("otp").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})

export type InsertWriter = typeof Writer.$inferInsert
export type SelectWriter = typeof Writer.$inferSelect