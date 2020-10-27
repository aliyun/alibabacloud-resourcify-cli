# AlibabaCloud Resourcify CLI (ARC)

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![codecov][cov-image]][cov-url]
[![Total alerts][alerts-image]][alerts-url]
[![Language grade: JavaScript][grade-image]][grade-url]

[npm-image]: https://img.shields.io/npm/v/@alicloud/arc.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@alicloud/arc
[travis-image]: https://img.shields.io/travis/aliyun/alibabacloud-resourcify-cli/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/aliyun/alibabacloud-resourcify-cli
[cov-image]: https://codecov.io/gh/aliyun/alibabacloud-resourcify-cli/branch/master/graph/badge.svg
[cov-url]: https://codecov.io/gh/aliyun/alibabacloud-resourcify-cli
[alerts-image]:https://img.shields.io/lgtm/alerts/g/aliyun/alibabacloud-resourcify-cli.svg?logo=lgtm&logoWidth=18
[alerts-url]:https://lgtm.com/projects/g/aliyun/alibabacloud-resourcify-cli/alerts/
[grade-image]:https://img.shields.io/lgtm/grade/javascript/g/aliyun/alibabacloud-resourcify-cli.svg?logo=lgtm&logoWidth=18
[grade-url]:https://lgtm.com/projects/g/aliyun/alibabacloud-resourcify-cli/context:javascript


ARC is a brand-new Alibaba Cloud CLI environment oriented to resourceization, and is a collection of multiple command line tools.

## Installation

*Please confirm that you have a Node.js development environment before installation. You can find it from https://nodejs.org/ *

Install ARC using the following command:

```sh
$ npm i @alicloud/arc -g
```

The currently included command line tools are as follows:

1. `arc`: call all Alibaba Cloud resource commands supported by ARC
`arc <product> <resource> <action> [options]`
2. `arc-tool`: call related commands of ARC itself
`arc-tool <command> [subCommand] [options]`
3. `arc-cs`: Call CS related resource commands
`arc-cs <resource> <action> [options]`

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
$ arc-tool config set sts_token <value>
```

For more configuration related commands, please use the configuration help command: `arc-tool config help`

## Use help information

ARC has built-in help information for all commands and their parameters. You can add the `help` command after the command to get help information for related commands, for example:
1. Obtain the operational resource information of CS products supported by ARC:
`arc cs help` or `arc-cs help`
2. Obtain the related operations of the instance resource of CS product supported by ARC:
`arc cs instance help` or `arc-cs instance help`
3. Get configuration related operations supported by ARC:
`arc-tool help`

## Use interactive mode

All ARC tools can use interactive mode to fill in command parameters.

### Enable

Add `-i` or `--interaction` after any command to enable interactive mode. And at the end of the configuration, the complete related commands are printed, which is convenient for users to continue to use later. Finally, the user can choose whether to directly run the command just filled.

Use interactive input to configure the test configuration:

```sh
$ arc-tool config --profile test
? Access Key ID
access-key-id <accessKeyId>
? Access Key Secret
access-key-secret <accessKeySecret>
? the ID of the region
region cn-hangzhou
? the language of CLI
language en
? Whether to execute Yes
arc-tool config --access-key-id <accessKeyId> --access-key-secret <accessKeySecret> --region cn-hangzhou --language en
```

## Advantage

ARC has powerful advantages for complex command parameters and can assist user input in many ways:

*The following examples are all cut from the same command: `arc-cs cluster create -i`*

*Angle brackets indicate user input*

1. Prompt for parameter input and supplemented by parameter description, the user does not need to remember:
```sh
? The ID of the region where the cluster is deployed.
region <region>
? The name of the cluster. The name can contain uppercase letters, lowercase  
letters, Chinese characters, digits, and hyphens (-).
name <name>
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

5. Automatically hide the parameters according to the parameter dependency, reducing user input

```sh
## When the selection is true, you need to enter data disk related information
? Specifies whether to mount data disks to worker nodes
worker-data-disk true

The data disk configurations of worker nodes, such as the disk type and disk  
size. This parameter takes effect only if worker_data_disk is set to true.
? Whether to enable snapshot
autoSnapshotPolicyId (Use arrow keys)
❯ true 
  false 
  [UNSET]

## When the selection is false, there is no 
## need to enter data disk related information
? Specifies whether to mount data disks to worker nodes
worker-data-disk <false>
? The billing method of worker nodes. Valid values:
PrePaid: subscription.
PostPaid: pay-as-you-go.

worker-instance-charge-type 
  PrePaid 
❯ PostPaid 
  [UNSET] 
```

6. Prompt input for complex parameter value structure

```sh
# map type parameter value
The runtime of containers. Default value: docker. Specify the runtime name and
version.
? Whether to configure runtime Yes
? runtime name
name <name>
? runtime version
version <version>

# For array parameter values
The ECS instance types of worker nodes
? The ECS instance type
element element
? Whether to continue to configure worker-instance-types Yes
? The ECS instance type
element element2
? Whether to continue to configure worker-instance-types No

```

# License

The Apache License 2.0. See [Apache-2.0](/LICENSE)

Copyright (c) 2009-present, Alibaba Cloud All rights reserved.
