# datax-tech

www.datax.tech 网站的源码

### 1. 开发环境部署

安装服务器依赖环境 node,npm,gulp,sass(gem install)

启动数据库服务器

```
docker run -p 3306:3306 --name mysql-instance -e MYSQL_ROOT_PASSWORD=mysql -d mysql
docker run -p 6379:6379 --name redis-instance -d redis
```

创建数据库

```
mysql -uroot -h127.0.0.1 -p < db.sql
npm run migration
```

启动开发环境

```
gulp
```
