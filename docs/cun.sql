CREATE TABLE "public"."cun" (
  id serial4,
  code varchar(50),
  codeName varchar(50),
  state int2,
  xiang_code varchar(50),
  geom "public"."geometry",
  CONSTRAINT "cun_pkey1" PRIMARY KEY ("id")
);
ALTER TABLE "public"."cun" OWNER TO "postgres";

CREATE INDEX "cun_geom_idx" ON "public"."cun" USING gist (
  "geom" "public"."gist_geometry_ops_2d"
);

CREATE UNIQUE INDEX "cun_id_idx" ON "public"."cun" USING btree (
  "id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
