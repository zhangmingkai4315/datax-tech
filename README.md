# datax-tech
www.datax.tech网站的源码



### 1. 开发环境部署

安装服务器依赖环境node,npm,gulp,sass(gem install)

启动数据库服务器

```
docker run --name mysql-instance -e MYSQL_ROOT_PASSWORD=mysql -d mysql 
```
创建数据库

```
mysql -uroot -h172.17.0.2 -p < db.sql
```

启动开发环境

```
gulp
```