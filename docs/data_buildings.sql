CREATE TABLE "public"."data_buildings" (
  uuid: varchar(50),
  source int2,
  sjzt int2,
  hy_state int2,
  sh_state int2,
  floor_count int2,
  xz_population int2,
  xz_door_count int2,
  risk int2,
  cooperate int2,
  build_state int2,
  build_name varchar(100),
  address_detail varchar(100),
  sortid varchar(100),
  geom "public"."geometry",
  CONSTRAINT "data_buildings_pkey1" PRIMARY KEY ("uuid")
)
;
ALTER TABLE "public"."data_buildings" OWNER TO "postgres";

ALTER TABLE "public"."data_buildings" ADD CONSTRAINT "data_buildings_pkey" PRIMARY KEY ("id");

CREATE INDEX "data_buildings_geom_idx" ON "public"."data_buildings" USING gist (
  "geom" "public"."gist_geometry_ops_2d"
);

CREATE INDEX "data_buildings_uuid_idx" ON "public"."data_buildings" USING hash (
  "uuid" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops"
);