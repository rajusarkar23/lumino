CREATE TYPE "public"."blog_category" AS ENUM('fitness', 'mental_health', 'finance');--> statement-breakpoint
CREATE TABLE "blog" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"thumbnail_image" text NOT NULL,
	"content" text NOT NULL,
	"writer_id" integer NOT NULL,
	"category" "blog_category" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "blog_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_writer_id_writer_id_fk" FOREIGN KEY ("writer_id") REFERENCES "public"."writer"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "writer" ADD CONSTRAINT "writer_email_unique" UNIQUE("email");