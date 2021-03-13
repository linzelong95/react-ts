### 关于

```
本项目主要集合spa、ssr、server为一体，用blog应用作为实践，以node为中心，处理spa、ssr页面的访问及api请求。
涉及的技术栈：react、redux、next.js、egg.js、antd、webpack、eslint、prettier
```

### 开发

```bash
# 启动web（根目录下）

# 安装依赖
npm ci

# 构建dll（如果文件已存在，不需重复构建）
npm run dll

# 启动webpack devServer
# npm run dev b-blog 只启动b-blog模块
# npm run dev account b-blog 启动account和b-blog两个模块
npm run dev 模块名1 模块名2 ...

```

```bash
# 启动server（egg.js、nextjs）

# 进入server目录
cd server

# 安装依赖
npm ci

# 启动
npm run dev

```

### 打包

```bash
# 根目录下对单页面应用进行打包

# 基础模块打包（如果文件已存在，并且依赖版本未变动，无需重复执行）
npm run build base

# 应用模块打包
# npm run build b-blog 只打包b-blog模块
# npm run build account b-blog 打包account和b-blog两个模块
npm run build 模块名1 模块名2 ...

```

### 部署(next)

```bash

# 根目录下安装依赖
npm ci

# next应用打包
npm run next

```

### 部署(server)

```bash
# 切换到 server 目录
cd server


# 安装依赖
npm ci

# 用config.local.ts替换config.prod.ts

# 将ts编译成js
npm run ci

# 启动/终止
npm run start/stop


```

### nginx(一个例子)

```bash
# 进入nginx目录
cd /etc/nginx

# 修改nginx配置
vim nginx.conf

# 重启nginx
systemctl reload nginx

# 启动nginx
systemctl start nginx

# ======= nginx.conf ========
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log;
pid /run/nginx.pid;

# Load dynamic modules. See /usr/share/nginx/README.dynamic.
include /usr/share/nginx/modules/*.conf;

events {
    worker_connections 1024;
}

http {
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;
    default_type        application/octet-stream;

    # Load modular configuration files from the /etc/nginx/conf.d directory.
    # See http://nginx.org/en/docs/ngx_core_module.html#include
    # for more information.
    include /etc/nginx/conf.d/*.conf;

    upstream tomcat{
        server 120.78.139.146:8080 weight=1;
    }

    upstream my_server{
        server 127.0.0.1:7001;
    }

    server {
        listen       80 default_server;
        listen       [::]:80 default_server;
        server_name  localhost;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

        location / {
            # 等同于 proxy_pass http://my_server;
            proxy_pass http://127.0.0.1:7001;
        }


        #location / {
        #	root /home/wwwroot/ftptest/blog/react;
        #	index index.html;
        #	try_files $uri $uri/ /index.html;
        #}

        #location /api/ {
        #    proxy_pass http://my_server/;
        #    proxy_set_header Host $host:$server_port;
        # }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }


    # =======第二个=====
    server {
        listen       8089;
        server_name  120.78.139.146:8089;
        root         /usr/share/nginx/html;

        # Load configuration files for the default server block.
        include /etc/nginx/default.d/*.conf;

#        location / {
#		        proxy_pass http://tomcat;
#         }

        location / {
            root /home/wwwroot/ftptest/blog/vue;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://my_server/;
            proxy_set_header Host $host:$server_port;
        }

        error_page 404 /404.html;
            location = /40x.html {
        }

        error_page 500 502 503 504 /50x.html;
            location = /50x.html {
        }
    }

#
#    server {
#        listen       443 ssl http2 default_server;
#        listen       [::]:443 ssl http2 default_server;
#        server_name  _;
#        root         /usr/share/nginx/html;
#
#        ssl_certificate "/etc/pki/nginx/server.crt";
#        ssl_certificate_key "/etc/pki/nginx/private/server.key";
#        ssl_session_cache shared:SSL:1m;
#        ssl_session_timeout  10m;
#        ssl_ciphers HIGH:!aNULL:!MD5;
#        ssl_prefer_server_ciphers on;
#
#        # Load configuration files for the default server block.
#        include /etc/nginx/default.d/*.conf;
#
#        location / {
#        }
#
#        error_page 404 /404.html;
#            location = /40x.html {
#        }
#
#        error_page 500 502 503 504 /50x.html;
#            location = /50x.html {
#        }
#    }

}


```

### TODO

```
1、用 eslint-webpack-plugin 代替 eslint-loader
2、处理server端不符合eslint规则的地方（目前已忽略检测）
3、优化server端报错提示
4、处理启用、禁用、删除、编辑等操作之间的约束关系
5、把server博客相关的文件放在博客模块里
6、next页面缓存
7、根目录下common文件夹处理成ssr-spa公用文件
```

### 其他待研究

```
日志可视化工具
www.elastic.co/cn/kibana
拓展：Logstash、Elasticsearch、Beats
filebeat 日志收集 ----> logstash 对日志格式化、过滤 ------> elasticsearch 分布式存储、全文索引 ---> kibana 日志聚合展示， 这是一套完善的日志收集、分析、可视化系统
```
