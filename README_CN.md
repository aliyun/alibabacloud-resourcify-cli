# AlibabaCloud Resourcify CLI（ARC）

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![codecov][cov-image]][cov-url]

[npm-image]: https://img.shields.io/npm/v/@alicloud/arc.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@alicloud/arc
[travis-image]: https://img.shields.io/travis/aliyun/alibabacloud-resourcify-cli/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/aliyun/alibabacloud-resourcify-cli
[cov-image]: https://codecov.io/gh/aliyun/alibabacloud-resourcify-cli/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/aliyun/alibabacloud-resourcify-cli

ARC 是面向资源化的全新阿里云 CLI 环境，是多个命令行工具的合集。

## 安装

*安装前请确认具有 Node.js 开发环境，您可以从 https://nodejs.org/ 下载*

使用以下命令安装 ARC ：

```sh
$ npm i @alicloud/arc -g
```

现有包含的命令行工具如下：

1. `arc`: 调用 ARC 支持的所有阿里云资源命令  
`arc <product> <resource> <action> [options]`
2. `arc-tool`: 调用 ARC 本身相关命令  
`arc-tool <command> [subCommand] [options]`
3. `arc-cs`: 调用 CS 相关资源命令  
`arc-cs <resource> <action> [options]`

## 全局选项

1. `profile`: 指定当前使用配置名
2. `interaction`: 使用交互模式填充命令
3. `region`: 指定阿里云区域

## ARC 配置

在使用 ARC 操作阿里云资源前，需要配置 ARC 相关环境。

ARC 配置文件默认路径为： `$HOME/.aliyun/arc.json`。

### 配置凭证

ARC目前支持AK，StsToken凭证，各类型对应字段如下：

1. AK凭证：  
`access_key_id`: 凭证 ID
`access_key_secret`: 凭证 secret

2. StsToken 凭证：  
`access_key_id`: 凭证 ID
`access_key_secret`: 凭证 secret
`sts_token`: 凭证 token

快速配置 AK 凭证：

```sh
$ arc-tool config --access-key-id accessKeyId --access-key-secret accessKeySecret --region region
```

ARC 默认配置 AK 凭证，如需要其他凭证，请使用 `config` 的子命令对 ARC 配置进行操作以增删必要字段。如将默认配置变更为StsToken凭证：

```sh
$ arc-tool config set access_key_id <value>
$ arc-tool config set access_key_secret <value>
$ arc-tool config set sts_token <value>
```

更多配置相关命令请使用配置帮助命令：`arc-tool config help`。

## 使用帮助信息

ARC 内置了所有命令及其参数的帮助信息，您可以在命令后面加上 `help` 命令以获取相关命令的帮助信息，例如：
1. 获取ARC支持的CS产品可操作资源信息：  
`arc cs help` 或者 `arc-cs help`
2. 获取ARC支持的CS产品下 instance 资源的相关操作：  
`arc cs instance help` 或者 `arc-cs instance help`
3. 获取ARC支持的配置相关操作：  
`arc-tool help`

## 使用交互模式

ARC 的工具都可以使用`交互模式`来进行命令参数的填充。

### 启用

在任意命令后面加入`-i`或者`--interaction`以启用交互模式。并在配置结束时，打印完整的相关命令，便于用户后期继续使用。最后用户可以选择是否直接运行刚刚填充的命令。

使用交互式输入配置 test 配置：

```sh
$ arc-tool config -i --profile test
? 凭证ID
access-key-id <accessKeyId>
? 凭证密钥
access-key-secret <accessKeySecret>
? 阿里云区域
region cn-hangzhou
? CLI语言
language zh
? 是否执行 Yes
arc-tool config  --access-key-id accessKeyId --access-key-secret accessKeySecret --region cn-hangzhou --language zh
```

## 优势

ARC针对复杂命令参数具有强大优势，可从多方面辅助用户输入：

*以下示例均截选自同一条命令：`arc-cs cluster create -i`*

*尖括号表示用户输入*

1. 提示参数输入并辅以参数说明，用户无需记忆：

```sh
? 集群所在地域ID
region <region>
? 集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。
name <name>
```

2. 对冲突参数进行提示
```sh
? 以下选项具有冲突，请选择其中一项 (Use arrow keys)
❯ login-password 
  key-pair 
```

3. 基本参数类型检查

```sh
? Worker节点系统盘大小，单位为GiB
worker-system-disk-size <string>
>> 值不为Number类型
```

4. 参数值具有可选范围，使用箭头便于用户选择


```sh
? 数据盘类型
category (Use arrow keys)
❯ cloud 
  cloud_efficiency 
  cloud_ssd 
  [UNSET] 
```

5. 自动根据参数依赖关系，对参数进行隐藏，减少用户输入

```sh
## 当选择为true，则需输入数据盘相关信息
? 表示worker节点是否挂载数据盘
worker-data-disk <true>
Worker数据盘类型、大小等配置的组合。该参数只有在挂载Worker节点数据盘时有效
? 数据盘类型
category (Use arrow keys)
❯ cloud 
  cloud_efficiency 
  cloud_ssd 
  [UNSET] 

## 当选择为false，则无需输入数据盘相关信息
? 表示worker节点是否挂载数据盘
worker-data-disk <false>
? Worker节点付费类型
worker-instance-charge-type (Use arrow keys)
❯ PrePaid 
  PostPaid 
  [UNSET] 
```

6. 针对复杂参数值结构进行提示输入

```sh
# map型参数值
容器运行时，一般为docker，包括2个信息：name和version
? 是否配置runtime <Yes>
? 容器运行时名称
name <name>
? 容器运行时版本
version <version>

# 针对数组型参数值
Worker节点ECS规格类型代码
? ECS规格类型代码
element element
? 是否继续配置worker-instance-types <Yes>
? ECS规格类型代码
element element2
? 是否继续配置worker-instance-types <No>
```

# 开源许可证

采用 Apache License 2.0. 参见 [Apache-2.0](/LICENSE)

Copyright (c) 2009-present, Alibaba Cloud All rights reserved.
