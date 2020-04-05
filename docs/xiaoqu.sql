CREATE TABLE "public"."xiaoqu" (
  "id" serial4,
  "code" varchar(50),
  "codeName" varchar(50),
  "state" int2,
  "xz_population" int2,
  geom "public"."geometry",
  CONSTRAINT "xiaoqu_pkey1" PRIMARY KEY ("id")
);
ALTER TABLE "public"."xiaoqu" OWNER TO "postgres";

CREATE INDEX "xiaoqu_geom_idx" ON "public"."xiaoqu" USING gist (
  "geom" "public"."gist_geometry_ops_2d"
);

CREATE UNIQUE INDEX "xiaoqu_id_idx" ON "public"."xiaoqu" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
