CREATE TABLE "public"."BUIA" (
  id serial4,
  "CLASID" varchar(10),
  geom "public"."geometry"
)
;
ALTER TABLE "public"."BUIA" OWNER TO "postgres";

ALTER TABLE "public"."BUIA" ADD CONSTRAINT "BUIA_pkey" PRIMARY KEY ("id");

CREATE INDEX "BUIA_geom_idx" ON "public"."BUIA" USING gist (
  "geom" "public"."gist_geometry_ops_2d"
);

CREATE INDEX "BUIA_id_idx" ON "public"."BUIA" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);