import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_seo_pages_page" AS ENUM('home', 'about', 'services', 'work', 'contact', 'service-web-development', 'service-mobile-apps', 'service-ui-ux-design', 'service-custom-software', 'service-e-commerce', 'service-ai-automation', 'service-seo-growth', 'service-cloud-devops', 'service-digital-marketing', 'service-maintenance-support');
  CREATE TABLE "seo_pages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"page" "enum_seo_pages_page" NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"noindex" boolean
  );
  
  CREATE TABLE "seo_meta_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"content" varchar NOT NULL
  );
  
  CREATE TABLE "seo" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"google" varchar,
  	"bing" varchar,
  	"facebook" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "seo_pages" ADD CONSTRAINT "seo_pages_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_pages" ADD CONSTRAINT "seo_pages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_meta_tags" ADD CONSTRAINT "seo_meta_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "seo_pages_order_idx" ON "seo_pages" USING btree ("_order");
  CREATE INDEX "seo_pages_parent_id_idx" ON "seo_pages" USING btree ("_parent_id");
  CREATE INDEX "seo_pages_image_idx" ON "seo_pages" USING btree ("image_id");
  CREATE INDEX "seo_meta_tags_order_idx" ON "seo_meta_tags" USING btree ("_order");
  CREATE INDEX "seo_meta_tags_parent_id_idx" ON "seo_meta_tags" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "seo_pages" CASCADE;
  DROP TABLE "seo_meta_tags" CASCADE;
  DROP TABLE "seo" CASCADE;
  DROP TYPE "public"."enum_seo_pages_page";`)
}
