-- 超时设置
SET statement_timeout TO 3000000;

--更新区划代码
UPDATE "BUIA" 
SET area_code = data_cun.code
FROM
	data_cun 
WHERE
	data_cun.code LIKE'320102%' and "BUIA".created_at >'2020-04-30 00:00:00'
	AND st_contains ( st_setsrid ( data_cun.geom, 4326 ), st_setsrid ( "BUIA".geom, 4326 ) );

	-- 手工导入data_buildings表
INSERT INTO "data_buildings"(geom,created_user,updated_user,
in_code,process_in_code,"source",hy_state) SELECT
	st_setsrid(geom,4326),
	'898735',
	'898735',
	area_code,
	area_code ,
	2,
	1
FROM
	"BUIA"
WHERE
 area_code like '320102010001%' 