CREATE TABLE "subscibers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	CONSTRAINT "subscibers_email_unique" UNIQUE("email")
);
