--数据跨库迁移 
-- SET statement_timeout TO 3000000;
--更新区划代码
UPDATE predict_buildings 
SET in_code = data_cun.code,
process_in_code = data_cun.process_code 
FROM
	data_cun 
WHERE
	data_cun.code LIKE'3601%' 
	AND st_contains ( st_setsrid ( data_cun.geom, 4326 ), st_setsrid ( predict_buildings.geom, 4326 ) );

--更新其他属性
UPDATE predict_buildings 
SET SOURCE = 1,
created_user = 'ADMIN',
updated_user = 'ADMIN' 
WHERE
	updated_at BETWEEN '2020-04-17 15:00' 
	AND '2020-04-20'
	
-- 手工导入data_buildings表
INSERT INTO "data_buildings"(geom,created_user,updated_user,
in_code,process_in_code) SELECT
	geom,
	created_user,
	updated_user,
	in_code,
	process_in_code 
FROM
	"predict_buildings" 
WHERE
 task_id between 22252 and 22294 --source默认为1

--data_buildings表有缺属性的条目360112102 430102001 2000+条