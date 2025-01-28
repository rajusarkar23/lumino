import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const Subscribers = pgTable("subscibers", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique()
})

export const Writer = pgTable("writer", {
    id: serial("id").primaryKey(),
    email: text("email").notNull().unique(),
    password: text("password").notNull(),
    otp: text("otp").notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})

export const blogCategory = pgEnum("blog_category", ["fitness", "mental_health", "finance"])

export const Blog = pgTable("blog", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    thumbnailImage: text("thumbnail_image").notNull(),
    content: text("content").notNull(),
    writerId: integer("writer_id").notNull().references(() => Writer.id, { onDelete: "cascade" }),
    category: blogCategory("category").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().$onUpdate(() => new Date())
})