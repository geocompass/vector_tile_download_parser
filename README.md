# 遥感影像地图自动下载工具使用说明

## 本工具特点

- 根据按行政区划范围下载瓦片
- 支持谷歌、天地图、矢量切片，以及各类 `x={x}&y={y}&z={z}` 形式的瓦片
- 支持标准 Mapbox 瓦片信息解析

## 一、硬件准备

- 能够运行用印象地图下载工具的设备一台。
- 数据库和下载工具可分开为两个服务器部署，也可放在一起。
- 操作系统，Windows 和 Linux 均可。

## 二、系统环境准备

### （一）MongoDB 数据库部署

具体步骤略，请自行部署 MongoDB 数据库。
版本无限制，近期可用版均可。

### （二） PostgreSQL+PostGIS 数据库部署

具体步骤略，请自行部署 PostgreSQL+PostGIS 数据库。
版本：8.x 以后版本均可。

### （三） Nodejs 环境准备

具体步骤略，请自行部署 Nodejs 运行环境。
版本请使用 LTS 版，8.xLTS、10.xLTS、12.xLTS 均可。

### （四） Python 环境准备

具体步骤略，请自行部署 Python 运行环境。
版本为：Python3.6 及更新 3.x 版本。

## 三、 影像下载工具代码部署

### （一） Nodejs 代码部署

#### 1、 安装Node项目依赖包

联网状态下，执行以下命令：

```shell
cd vector_tile_download_parser
npm i
```

如果下载速度慢，可切换为国内源：

```shell
npm config set registry https://registry.npm.taobao.org
# 配置后可通过下面方式来验证是否成功
npm config get registry
# 或npm info express
```



#### 2、 谷歌或天地图瓦片连接信息配置

在 `config/config.default.js` 中配置相关瓦片地址信息，如果需要下载天地图，请注册天地图并使用 `服务端` token。

```javascript
//config/config.default.js
const userConfig = {
    tile_urls: {
      google_image: `http://ditu.google.cn/maps/vt/lyrs=s&x={x}&y={y}&z={z}`,//谷歌影像地址
      tdt_image: `https://t1.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=tianditu_token`,//天地图地址
      vector_tile: `http://172.16.108.201:7002/api/v1/tileset/11001000001/4/{z}/{x}/{y}.pbf`,//矢量切片地址
    }
}
```



#### 3、配置Python 瓦片计算服务连接信息

```javascript
//config/config.default.js
const userConfig = {
    python_cover_host: "http://127.0.0.1:5004"
}
```



#### 4、 配置数据库连接信息

    //config/config.default.js
    const userConfig = {
        mongo_config: "mongodb://127.0.0.1:27017/vector_tile",
        sequelize: {
          dialect: "postgres",
          host: "127.0.0.1",
          port: 5432,
          database: "quhua_data",
          username: "postgres",
          password: "postgres",
        }
    }

#### 5、启动服务

```shell
npm start //正式启动
npm run debug //以调试模式启动，可查看输出
```

#### 6、服务部署测试

访问以下地址，测试能否正常返回内容。

```http
http://127.0.0.1:7001/
```



### （二） Python 代码部署

#### 1、安装Python依赖包

联网状态下，执行以下命令，安装Python依赖包：

```shell
cd vector_tile_download_parser
pip install -r requirements.txt
```

#### 2、配置数据库连接信息

```python
# cover_server.py
SQLALCHEMY_DATABASE_URI = 'postgres+psycopg2://postgres:postgres@127.0.0.1/quhua_data' #PostgreSQL数据库连接
myclient = pymongo.MongoClient("mongodb://127.0.0.1:27017/tile_downloader") #MongoDB数据库连接
```

#### 3、区划边界数表名称配置

```python
quhuaTable = 'data_xian'
if len(area_code) == 6:
    quhuaTable = "data_xian" # 县边界
elif len(area_code) == 4:
    quhuaTable = "quhua_shi"  # 市边界
elif len(area_code) == 2:
    quhuaTable = "quhua_sheng"  # 省边界
```

#### 4、启动服务

```shell
python cover_server.py
```

#### 6、服务部署测试

访问以下地址，测试能否正常返回内容。

```http
http://127.0.0.1:5004/
```



## 四、 区划数据准备

### （一）在PostGIS中导入区划边界数据

导入带有区划代码的区划编辑数据，并且区划代码字段名称为：`code`。

区划边界数据命名规则：

```
"data_xian" # 县边界
"quhua_shi"  # 市边界
"quhua_sheng"  # 省边界
```

如果不符合规则，可在上述Python代码中修改。



## 五、 使用说明



### （一）指定下载范围

以下载`海淀区`范围内的`14级`的`谷歌` `遥感影像`为例，：

-  `area_code` 为 `110108`
- 下载级别为 `14` 级
- 下载内容为：`google_image`，需要与上述第三章中配置的信息一致。
- `tile_type` 是指下载的是`影像`还是`矢量`。

```http
http://127.0.0.1:7001/cover?area_code=110108&zoom=14&collection=google_image&tile_type=image
```

以上命令执行后，会在 `MongoDB` 数据库中创建名字为 `google_image` 的表（`collection`）。

### （二）开启下载任务

以上述准备的下载任务为例，访问以下地址即可开启下载任务：

- 下载的 `collection` 为：`google_image`，需要与上述创建任务的 `collection` 一致。

```http
http://127.0.0.1:7001/start_download?collection=google_image
```

以上命令执行后会自动下载未下载的影像，直到所有下载任务完成。

### （三）调用下载的地图服务

以上瓦片下载完成后，可对下载的瓦片调用，使用QGIS等工具查看预览，配置内容如下：

```http
http://127.0.0.1:7001/wmts?collection=google_image&x={x}&y={y}&z={z}
```







