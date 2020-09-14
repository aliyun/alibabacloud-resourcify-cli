'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs node attach',
    desc: {
        zh: '添加已有ECS节点到Kubernetes集群'
    },
    options: {
        'key-pair': {
            required:true,
            mapping: 'keyPair',
            desc: {
                zh: 'key-pair名称'
            },
            conflicts:[
                'password'
            ]
        },
        'password': {
            required:true,
            mapping: 'password',
            desc: {
                zh: '扩容的worker节点密码。密码规则为8~30 个字符，且同时包含三项（大、小写字母，数字和特殊符号）'
            },
            conflicts:[
                'key-pair'
            ]
        },
        'format-disk': {
            mapping: 'formatDisk',
            vtype: 'boolean',
            desc: {
                zh: '是否格式化数据盘'
            }
        },
        'keep-instance-name': {
            mapping: 'keepInstanceName',
            vtype: 'boolean',
            desc: {
                zh: '是否保留实例名称'
            }
        },
        'cpu-policy': {
            mapping: 'cpuPolicy',
            desc: {
                zh: 'CPU策略。Kubernetes集群版本为1.12.6及以上版本支持static和none两种策略，默认为none。'
            }
        },
        'instances': {
            mapping: 'instances',
            vtype: 'array',
            subType:'string',
            desc: {
                zh: '实例列表'
            },
            options:{
                element: {
                    required:true,
                    desc: {
                        zh: 'ECS规格类型代码'
                    }
                }
            }
        },
        tags: {
            mapping: 'tags',
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').AttachInstancesBodyTags,
            desc: {
                zh: '自定义节点标签'
            },
            example: `key=tier,value=backend`,
            options: {
                key: {
                    desc: {
                        zh: '标签名称'
                    }
                },
                value: {
                    desc: {
                        zh: '标签值'
                    }
                }
            }
        },
    },
    args: [
        {
            name: 'clusterId',
            required: true
        }
    ]
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption();
    let { Config } = require('@alicloud/roa-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let AttachInstancesRequest = require(`@alicloud/cs20151215`).AttachInstancesRequest;
    let request = new AttachInstancesRequest({});

    let AttachInstancesBody = require('@alicloud/cs20151215').AttachInstancesBody;
    let body = new AttachInstancesBody(argv._mappingValue);

    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.attachInstancesWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};