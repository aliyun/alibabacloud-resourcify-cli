'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster scaleout',
    desc: {
        zh: '增加集群中Worker节点的数量'
    },
    options: {
        'count': {
            required: true,
            mapping: 'count',
            vtype: 'number',
            desc: {
                zh: '扩容实例数量'
            }
        },
        'key-pair': {
            required: true,
            mapping: 'keyPair',
            desc: {
                zh: 'key_pair名称'
            },
            conflicts: [
                'login-password'
            ]
        },
        'login-password': {
            required: true,
            mapping: 'loginPassword',
            desc: {
                zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号），和key_pair 二选一。'
            },
            conflicts: [
                'key-pair'
            ]
        },
        'worker-data-disk': {
            required: true,
            mapping: 'workerDataDisk',
            vtype: 'boolean',
            desc: {
                zh: '表示worker节点是否挂载数据盘'
            }
        },
        'worker-data-disks': {
            mapping: 'workerDataDisks',
            dependency: true,
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').ScaleOutClusterRequestWorkerDataDisks,
            desc: {
                zh: `Worker数据盘类型、大小等配置的组合`
            },
            example: `category=cloud,size=40,encrypted=false`,
            options: {
                category: {
                    desc: {
                        zh: '数据盘类型'
                    },
                    choices: [
                        'cloud',
                        'cloud_efficiency',
                        'cloud_ssd'
                    ]
                },
                size: {
                    desc: {
                        zh: '数据盘大小，单位为GiB'
                    }
                },
                encrypted: {
                    desc: {
                        zh: '是否对数据盘加密'
                    },
                    choices: [
                        'true',
                        'false'
                    ]
                }
            }
        },
        'worker-instance-types': {
            required: true,
            mapping: 'workerInstanceTypes',
            vtype: 'array',
            subType: 'string',
            desc: {
                zh: 'Worker节点ECS规格类型代码'
            },
            options: {
                element: {
                    desc: {
                        zh: 'ECS规格类型代码'
                    }
                }
            }
        },
        'worker-instance-charge-type': {
            mapping: 'workerInstanceChargeType',
            desc: {
                zh: 'Worker节点付费类型'
            },
            choices: [
                'PrePaid',
                'PostPaid'
            ],
            sufficient: function (val) {
                let optList = {};
                if (val === 'PrePaid') {
                    optList['worker-period'] = true;
                    optList['worker-auto-renew'] = true;
                    optList['worker-period-unit'] = true;
                }
                return optList;
            }
        },
        'worker-period': {
            mapping: 'workerPeriod',
            vtype: 'number',
            dependency: true,
            desc: {
                zh: '包年包月时长，当worker_instance_charge_type取值为PrePaid时才生效且为必选值，取值范围：PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”， “6”， “12”}'
            }
        },
        'worker-period-unit': {
            mapping: 'workerPeriodUnit',
            dependency: true,
            desc: {
                zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位'
            }
        },
        'worker-auto-renew': {
            mapping: 'workerAutoRenew',
            vtype: 'boolean',
            dependency: true,
            desc: {
                zh: '是否开启Worker节点自动续费'
            },
            sufficient: function (val) {
                let optList = {};
                if (val) {
                    optList['worker-auto-renew-period'] = true;
                }
                return optList;
            }
        },
        'worker-auto-renew-period': {
            mapping: 'workerAutoRenewPeriod',
            dependency: true,
            vtype: 'number',
            desc: {
                zh: 'Worker节点自动续费周期，当选择预付费和自动续费时才生效，'
            }
        },
        'worker-system-disk-category': {
            mapping: 'workerSystemDiskCategory',
            desc: {
                zh: 'Worker节点系统盘类型'
            },
            choices: [
                'cloud_efficiency',
                'cloud_ssd'
            ]
        },
        'worker-system-disk-size': {
            mapping: 'workerSystemDiskSize',
            vtype: 'number',
            desc: {
                zh: 'Worker节点系统盘大小，单位为GiB'
            }
        },
        'cloud-monitor-flags': {
            mapping: 'cloudMonitorFlags',
            vtype: 'boolean',
            desc: {
                zh: '是否安装云监控插件'
            }
        },
        'disable-rollback': {
            mapping: 'disableRollback',
            vtype: 'boolean',
            desc: {
                zh: '失败是否回滚'
            }
        },
        'cpu-policy': {
            mapping: 'cpuPolicy',
            desc: {
                zh: 'CPU策略。集群版本为1.12.6及以上版本支持static 和 none两种策略。默认为none'
            }
        },
        'vswitch-ids': {
            mapping: 'vswitchIds',
            vtype: 'array',
            subType: 'string',
            maxindex: 3,
            desc: {
                zh: 'Worker节点的虚拟交换机ID列表'
            },
            options: {
                element: {
                    required: true,
                    desc: {
                        zh: '节点交换机ID'
                    }
                }
            }
        },
        tags: {
            mapping: 'tags',
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').ScaleOutClusterRequestTags,
            desc: {
                zh: '给集群打tag标签：key：标签名称；value：标签值'
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
        taints: {
            mapping: 'taints',
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').ScaleOutClusterRequestTaints,
            desc: {
                zh: '用于给节点做污点标记，通常用于Pods的调度策略。与之相对应的概念为：容忍（tolerance），若Pods上有相对应的tolerance标记，则可以容忍节点上的污点，并调度到该节点。'
            },
            example: `key=tier,value=backend`,
            options: {
                key: {
                    desc: {
                        zh: 'taints名称'
                    }
                },
                value: {
                    desc: {
                        zh: 'taints值'
                    }
                },
                effect: {
                    desc: {
                        zh: ''
                    }
                }
            }
        },
    },
    args: [
        {
            name: 'clusterId',
            required: true,
            vtype: 'string'
        }
    ]
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption();
    let { Config } = require('@alicloud/openapi-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let ScaleOutClusterRequest = require(`@alicloud/cs20151215`).ScaleOutClusterRequest;
    let request = new ScaleOutClusterRequest(argv._mappingValue);

    let client = new Client(config);
    let result;
    try {
        result = await client.scaleOutClusterWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};