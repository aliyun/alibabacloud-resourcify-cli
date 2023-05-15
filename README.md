# AlibabaCloud Resourcify CLI (ARC)

[![NPM version][npm-image]][npm-url]
[![Node.js CI](https://github.com/aliyun/alibabacloud-resourcify-cli/actions/workflows/node.js.yml/badge.svg)](https://github.com/aliyun/alibabacloud-resourcify-cli/actions/workflows/node.js.yml)
[![codecov][cov-image]][cov-url]

[npm-image]: https://img.shields.io/npm/v/@alicloud/arc.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@alicloud/arc
[cov-image]: https://codecov.io/gh/aliyun/alibabacloud-resourcify-cli/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/aliyun/alibabacloud-resourcify-cli

ARC is a brand-new Alibaba Cloud CLI environment oriented to resourceization, and is a collection of multiple command line tools.

## Installation

> Please confirm that you have a Node.js development environment before installation. You can find it from https://nodejs.org/

Install ARC using the following command:

```sh
$ npm i @alicloud/arc -g
```

The currently included command line tools are as follows:

1. `arc`: call all Alibaba Cloud resource commands supported by ARC
`arc <product> <resource> <action> [options]`
2. `arc-tool`: call related commands of ARC itself
`arc-tool <command> [subCommand] [options]`
3. `arc-cs`: call CS related resource commands
`arc-cs <resource> <action> [options]`
4. `arc-display`: support query results with jmespath and custom output format
`arc-display --query <query> --format <format>`

## Global options

1. `profile`: Specify the current profile name
2. `interaction`: Use interactive mode to fill commands
3. `region`: Specify Alibaba Cloud region

## ARC configuration

Before using ARC to operate Alibaba Cloud resources, you need to configure the ARC related environment.

The default path of the ARC configuration file is:
`$HOME/.aliyun/arc.json`

### Configure credentials

ARC currently supports AK and StsToken certificates. The corresponding fields of each type are as follows:

1. AK certificate:
`access_key_id`: Credential ID
`access_key_secret`: credential secret

2. StsToken certificate:
`access_key_id`: Credential ID
`access_key_secret`: credential secret
`sts_token`: certificate token

Quickly configure AK credentials:
`arc-tool config --access-key-id accessKeyId --access-key-secret accessKeySecret --region region`

ARC configures AK credentials by default. If you need other credentials, please use the subcommand of `config` to operate the arc configuration to add or delete necessary fields. If you change the default configuration to StsToken credentials:

```sh
$ arc-tool config set access_key_id <value>
$ arc-tool config set access_key_secret <value>
```

For more configuration related commands, please use the configuration help command: `arc-tool config help`

## Use help information

ARC has built-in help information for all commands and their parameters. You can add the `help` command after the command to get help information for related commands, for example:
1. Obtain the operational resource information of CS products supported by ARC:
`arc cs help` or `arc-cs help`
2. Obtain the related operations of the cluster resource of CS product supported by ARC:
`arc cs cluster help` or `arc-cs cluster help`
3. Get configuration related operations supported by ARC:
`arc-tool help`

## Use interactive mode

All ARC tools can use interactive mode to fill in command parameters.

### Enable

Add `-i` or `--interaction` after any command to enable interactive mode. And at the end of the configuration, the complete related commands are printed, which is convenient for users to continue to use later. Finally, the user can choose whether to directly run the command just filled.

Use interactive input to configure the test configuration:

```sh
$ arc-tool config -i --profile test
? Access Key ID
access-key-id <accessKeyId>
? Access Key Secret
access-key-secret <accessKeySecret>
? the ID of the region
region cn-hangzhou
? the language of CLI
language en
```

## Advantage

ARC has powerful advantages for complex command parameters and can assist user input in many ways:

*The following examples are all cut from the same command: `arc-cs cluster create -i`*

*Angle brackets indicate user input*

1. Prompt for parameter input and supplemented by parameter description, the user does not need to remember:
```sh
? The name of the key pair.
key-pair <keyPair>
```

2. Prompt for conflicting parameters
```sh
? The following options conflict, please select one (Use arrow keys)
❯ login-password
  key-pair
```

3. Basic parameter type check

```sh
? The system disk size of a worker node. Unit: GiB.
worker-system-disk-size <string>
>> Value is not of type Number
```

4. The parameter value has an optional range, and the arrow is convenient for users to choose

```sh
? the type of the data disks
category (Use arrow keys)
❯ cloud
  cloud_efficiency
  cloud_ssd
  [UNSET]
```

5. Optional flags to reduce user input time

```sh
? Please select optional configuration or end configuration (Use arrow keys)
❯ region [string] The ID of the region where the cluster is deployed. 
  cluster-type [string] The type of the cluster 
  name [string] The name of the cluster. The name can contain uppercase letters, lowercase letters, Chinese characters, digits, and hyphens (-). 
  container-cidr [string] The CIDR block of containers. This CIDR block cannot overlap with that of the VPC. If the VPC is automatically created by the system, t
he CIDR block of containers is set to 172.16.0.0/16. 
  cloud-monitor-flags [boolean] Specifies whether to install the CloudMonitor agent. 
  disable-rollback [boolean] Specifies whether to retain all resources if the operation fails. Valid values:
true: retains the resources.
false: releases the resources.
Default value: true. We recommend that you use the default value. 
(Move up and down to reveal more choices)
```

6. Prompt the user to select a precondition
```sh
? Please select optional configuration or end configuration worker-data-disks
worker-data-disks
This parameter must meet the following conditions to be effective
When the value of worker-data-disk is equal to true
```

7. Prompt input for complex parameter value structure

```sh
# map type parameter value
? Please select optional configuration or end configuration runtime
runtime
The runtime of containers. Default value: docker. Specify the runtime name and
version.
?  runtime name 
runtime.name <runtime.name>
?  runtime version 
runtime.version <runtime.version>

# For array parameter values
? Please select optional configuration or end configuration pod-vswitch-ids
pod-vswitch-ids
Pod VSwitch IDs, in ENI multi-network card mode, you need to pass additional
vswitchid to addon. When creating a cluster of the terway network type, this
field is required.
? Pod VSwitch IDs, in ENI multi-network card mode, you need to pass additional vswitchid to addon. When creating a cluster of the terway network type, this field
 is required.
pod-vswitch-ids.0 <pod-vswitch-ids.0>
? Whether to continue to configure the 2 pod-vswitch-ids Yes
? Pod VSwitch IDs, in ENI multi-network card mode, you need to pass additional vswitchid to addon. When creating a cluster of the terway network type, this field
 is required.
pod-vswitch-ids.1 <pod-vswitch-ids.1>

```

# License

The Apache License 2.0. See [Apache-2.0](/LICENSE)

Copyright (c) 2009-present, Alibaba Cloud All rights reserved.
