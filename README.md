# seq-api

===========================================================================

++ 介绍：基于Node.js搭建的后台接口平台

++ 技术栈：Node.js、Express、Sequelize、MySQL

===========================================================================

安装express-generator

```
npm i -g express-generator@4
```

===========================================================================

开发Node.js项目，要先安装express-generator，这样才能使用命令，创建项目。

```
express --no-view [项目名]
```

===========================================================================

```
config/config.js：数据库连接配置
migrations：迁移文件
models：模型文件
seeders：种子文件

npm i -g sequelize-cli

全局安装sequelize和mysql驱动包
npm i sequelize mysql2

初始化sequelize
sequelize init

创建数据库
sequelize db:create --charset utf8mb4 --collate utf8mb4_general_ci

生成模型文件
sequelize model:generate --name Article --attributes title:string,content:text

生成迁移文件
sequelize db:migrate

生成种子
sequelize seed:generate --name article

运行某个或所有种子
sequelize db:seed --seed [种子文件名]/:all

回滚迁移
sequelize db:migrate:undo


```

===========================================================================

| 步骤   | 命令                                                         | 说明                               |
| ------ | ------------------------------------------------------------ | ---------------------------------- |
| 第一步 | sequelize model:generate --name Article --attributes title:string,content:text | 建模型和迁移文件                   |
| 第二部 | 人工处理                                                     | 根据需求修改迁移文件               |
| 第三步 | sequelize db:migrate                                         | 运行迁移，生成数据表               |
| 第四步 | sequelize seed:generate --name article                       | 新建种子文件                       |
| 第五步 | 人工处理                                                     | 将种子文件修改为自己想填充的数据   |
| 第六步 | sequelize db:seed --seed [种子文件名]                        | 运行种子文件，将数据填充到数据表中 |

===========================================================================

### 数据返回参数

| 返回数据的结构 | 说明                                           | 值                     |
| -------------- | ---------------------------------------------- | ---------------------- |
| status         | 表明当前接口是否是成功的                       | true：成功/false：失败 |
| message        | 就是给用户的提示信息                           | 例如：查询成功等       |
| data           | 里面放的就是查询出来，最终要显示给用户看的数据 | 一般来说是对象         |

===========================================================================

### 响应码说明

| 编码 | 说明                                                         |
| ---- | ------------------------------------------------------------ |
| 200  | 响应成功                                                     |
| 201  | 响应成功，并可能存在新资源信息的增加，常用于新增表单成功返回 |
| 400  | 请求语法错误、无效参数或格式不正确等问题                     |
| 404  | 资源不存在                                                   |

===========================================================================

### 自定义异常

```
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

module.exports = {
    NotFoundError,
}
```



===========================================================================

### API

##### 文章

| 请求方式 | 请求地址            | 说明         |
| -------- | ------------------- | ------------ |
| GET      | /admin/articles     | 查询文章列表 |
| GET      | /admin/articles/:id | 查询文章详情 |
| POST     | /admin/articles     | 创建文章     |
| PUT      | /admin/articles/:id | 更新文章     |
| DELETE   | /admin/articles/:id | 删除文章     |



##### 分类

| 请求方式 | 请求地址            | 说明         |
| -------- | ------------------- | ------------ |
| GET      | /admin/settings     | 查询分类列表 |
| GET      | /admin/settings/:id | 查询分类详情 |
| POST     | /admin/settings     | 创建分类     |
| PUT      | /admin/settings/:id | 更新分类     |
| DELETE   | /admin/settings/:id | 删除分类     |



##### 系统设置

| 请求方式 | 请求地址        | 说明         |
| -------- | --------------- | ------------ |
| GET      | /admin/settings | 查询系统设置 |
| PUT      | /admin/settings | 更新系统设置 |

===========================================================================

### 如何获取请求中的数据？

| 方法       | 说明                            | 例子                                                  |
| ---------- | ------------------------------- | ----------------------------------------------------- |
| req.params | 获取路由里的参数                | /admin/article/:id                                    |
| req.query  | 获取URL地址里的查询参数         | /admin/articles?title=hello&currentPage=2&pageSize=20 |
| req.body   | 获取通过POST、PUT请求发送的数据 |                                                       |

===========================================================================

### 操作数据库的常用方法

| 方法            | 说明                         |
| --------------- | ---------------------------- |
| findAll         | 查询所有记录                 |
| findAndCountAll | 查询所有记录，并统计数据总数 |
| findByPk        | 通过主键查询单条数据         |
| create          | 创建新数据                   |
| update          | 更新数据                     |
| delete          | 删除数据                     |
| findOne         | 查询第一条数据               |

===========================================================================

### 数据库表设计

##### Categories：分类表

| 字段         | 类型    | 允许Null | 无符号 | 自增 | 索引    | 默认值 |
| ------------ | ------- | -------- | ------ | ---- | ------- | ------ |
| id（编号）   | integer | NO       | YES    | YES  | PRIMARY | -      |
| name（名称） | varchar | NO       | -      | -    | -       | -      |
| rank（排序） | integer | NO       | YES    | -    | -       | 1      |

id（编号）：integer，主键，不为null，无符号，自增

name（名称）：varchar，不为null

rank（排序）：integer，无符号，不为null，默认值：1



##### Courses：课程表

| 字段                            | 类型    | 允许Null | 无符号 | 自增 | 索引    | 默认值 |
| ------------------------------- | ------- | -------- | ------ | ---- | ------- | ------ |
| id（编号）                      | integer | NO       | YES    | YES  | PRIMARY | -      |
| categoryId（分类ID）            | integer | NO       | YES    | -    | INDEX   | -      |
| userId（用户ID）                | integer | NO       | YES    | -    | INDEX   | -      |
| name（名称）                    | varchar | NO       | -      | -    | -       | -      |
| image（课程图片）               | varchar | -        | -      | -    | -       | -      |
| recommended（是否推荐课程）     | boolean | NO       | YES    | -    | INDEX   | false  |
| introductory（是否入门课程）    | boolean | NO       | YES    | -    | INDEX   | false  |
| content（课程内容）             | text    | -        | -      | -    | -       | -      |
| likesCount（课程的点赞数量）    | integer | NO       | YES    | -    | -       | 0      |
| chaptersCount（课程的章节数量） | integer | NO       | YES    | -    | -       | 0      |

id（编号）：integer，主键，不为null，无符号，自增

categoryId（分类ID）：integer，无符号，不为null，index索引

userId（用户ID）：integer，无符号，不为null，index索引

name（名称）：varchar，不为null

image（课程图片）：varchar

recommended（是否推荐课程）：boolean，无符号，不为null，默认false，index索引

introductory（是否入门课程）：boolean，无符号，不为null，默认false，index索引

content（课程内容）：text

likesCount（课程的点赞数量）：integer，无符号，不为null，默认0

chaptersCount（课程的章节数量）：integer，无符号，不为null，默认0



##### Chapters：章节表

| 字段                | 类型    | 允许Null | 无符号 | 自增 | 索引    | 默认值 |
| ------------------- | ------- | -------- | ------ | ---- | ------- | ------ |
| id（编号）          | integer | NO       | YES    | YES  | PRIMARY | -      |
| courseId（课程ID）  | integer | NO       | YES    | -    | INDEX   | -      |
| title（课程标题）   | varchar | NO       | -      | -    | -       | -      |
| content（课程内容） | text    | -        | -      | -    | -       | -      |
| video（视频地址）   | varchar | -        | -      | -    | -       | -      |
| rank（排序）        | integer | -        | YES    | -    | -       | 1      |

id（编号）：integer，主键，不为null，无符号，自增

courseId（课程ID）：integer，无符号，不为null，index索引

title（课程标题）：varchar，不为null

content（课程内容）：text

video（视频地址）：varchar

rank（排序）：integer，无符号，默认值1，不为null



##### Users：用户表

| 字段                   | 类型    | 允许Null | 无符号 | 自增 | 索引    | 默认值 | 备注                       |
| ---------------------- | ------- | -------- | ------ | ---- | ------- | ------ | -------------------------- |
| id（编号）             | integer | NO       | YES    | YES  | PRIMARY | -      |                            |
| email（电子邮箱）      | varchar | NO       | -      | -    | UNIQUE  | -      |                            |
| username（用户名）     | varchar | NO       | -      | -    | UNIQUE  | -      |                            |
| nickname（昵称）       | varchar | NO       | -      | -    | -       | -      |                            |
| password（密码）       | varchar | NO       | -      | -    | -       | -      |                            |
| avatar（头像）         | varchar | -        | -      | -    | -       | -      |                            |
| sex（性别）            | tinyint | NO       | YES    |      |         | 9      | 1为女性，9为不选择。       |
| company（公司/学校名） | varchar | -        | -      | -    | -       | -      |                            |
| introduce（自我介绍）  | text    | -        | -      | -    | -       | -      |                            |
| role（用户组）         | tinyint | NO       | YES    | -    | INDEX   | 0      | 0为普通用户，100为管理员。 |

id（编号）：integer，主键，不为null，无符号，自增

email（电子邮箱）：varchar，不为null，unique索引

username（用户名）：varchar，不为null，unique索引

nickname（昵称）：varchar，不为null

password（密码）：varchar，不为null

avatar（头像）：varchar

sex（性别）：tinyint，不为null，无符号。0为男性，1为女性，9为不选择。默认为：9

company（公司/学校名）：varchar

introduce（自我介绍）：text

role（用户组）：tinyint，不为null，无符号，index索引。0为普通用户，100为管理员。默认为：0



##### Likes：点赞表

| 字段               | 类型    | 允许Null | 无符号 | 自增 | 索引    |
| ------------------ | ------- | -------- | ------ | ---- | ------- |
| id（编号）         | integer | NO       | YES    | YES  | PRIMARY |
| courseId（课程ID） | integer | NO       | YES    | -    | INDEX   |
| userId（用户ID）   | integer | NO       | YES    | -    | INDEX   |

id（编号）：integer，主键，不为null，无符号，自增

courseId（课程ID）：integer，无符号，不为null，index索引

userId（用户ID）：integer，无符号，不为null，index索引



##### Settings：设置表

| 字段                  | 类型    | 允许Null | 无符号 | 自增 | 索引    |
| --------------------- | ------- | -------- | ------ | ---- | ------- |
| id（编号）            | integer | NO       | YES    | YES  | PRIMARY |
| name（项目名称）      | varchar | -        | -      | -    | -       |
| icp（备案号）         | varchar | -        | -      | -    | -       |
| copyright（版权信息） | varchar | -        | -      | -    | -       |

id（编号）：integer，主键，不为null，无符号，自增

name（项目名称）：varchar

icp（备案号）：varchar

copyright（版权信息）：varchar

===========================================================================

### 建立其他模型和表

分类

```
sequelize model:generate --name Category --attributes name:string,rank:integer
```



用户

```
sequelize model:generate --name User --attributes email:string,username:string,password:string,nickname:string,sex:tinyint,company:string,introduce:text,role:tinyint
```



课程

```
sequelize model:generate --name Course --attributes categoryId:integer,userId:integer,name:string,image:string,recommended:boolean,introductory:boolean,content:text,likesCount:integer,chaptersCount:integer
```



章节

```
sequelize model:generate --name Chapter --attributes courseId:integer,title:string,content:text,video:string,rank:integer
```



点赞

```
sequelize model:generate --name Like --attributes courseId:integer,userId:integer
```



设置

```
sequelize model:generate --name Setting --attributes name:string,icp:string,copyright:string
```



===========================================================================