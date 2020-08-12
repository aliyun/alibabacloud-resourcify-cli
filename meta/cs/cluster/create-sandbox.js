'use strict';
// TODO 文档不全，暂停
exports.cmdObj = {
    use: 'arc cs cluster create-sandbox',
    flags: {
        region: {
            mapping: 'regionId',
            required: true,
            hide: true,
            desc: {
                zh: '集群所在地域ID',
            }
        },
        name: {
            mapping:'name',
            desc: {
                zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。'
            }
        },
        'key-pair': {
            required:true,
            mapping: 'keyPair',
            desc: {
                zh: 'key_pair名称，和login_pwd二选一。'
            },
            conflicts:[
                'login-password'
            ]
        },
        'login-password': {
            required:true,
            mapping:'loginPassword',
            desc: {
                zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号），和key_pair 二选一。'
            },
            conflicts:[
                'key-pair'
            ]
        },
        'kubernetes-version': {
            required:true,
            mapping: 'kubernetesVersion',
            desc: {
                zh: 'Kubernetes集群版本，默认最新版，仅支持1.14.6-aliyun.1及以上版本'
            }
        },
        'num-of-nodes': {
            required: true,
            mapping: 'numOfNodes',
            vtype: 'number',
            desc: {
                zh: 'Worker节点数。范围是[0，100]'
            }
        },
        'pod-vswitch-ids': {
            required: true,
            mapping: 'podVswitchIds',
            vtype: 'array',
            subType: 'string',
            desc: {
                zh: 'Pod的虚拟交换机列表'
            },
            options: {
                element: {
                    desc: {
                        zh: '交换机ID'
                    }
                }
            }
        },
        'runtime': {
            required:true,
            mapping: 'runtime',
            vtype: 'map',
            desc: {
                zh: `name：安全容器运行时的名称，目前支持Sandboxed-Container.runv。version：当前版本1.0.0`
            },
            example: `name=docker,version=19.03.5`,
            options: {
                name: {
                    unchanged:true,
                    default:'Sandboxed-Container.runv',
                    desc: {
                        zh: '容器运行时名称'
                    }
                },
                version: {
                    desc: {
                        zh: '容器运行时版本'
                    }
                }
            }
        },
        'snat-entry': {
            required: true,
            mapping: 'snatEntry',
            vtype: 'boolean',
            desc: {
                zh: `是否为网络配置SNAT：当已有VPC能访问公网环境时，设置为 false。当已有VPC不能访问公网环境时：设置为true，表示配置SNAT，此时可以访问公网环境。设置为false，表示不配置SNAT，此时不能访问公网环境。`
            }
        },
        'vpcid': {
            required: true,
            mapping: 'vpcid',
            desc: {
                zh: 'vpcId和vswitchid只能同时都设置对应的值'
            }
        },
        'vswitch-ids': {
            required: true,
            mapping:'vswitchIds',
            type: 'array',
            subType:'string',
            maxindex: 3,
            desc: {
                zh: '交换机ID。List长度范围为 [1，3]'
            },
            options: {
                element: {
                    required: true,
                    desc: {
                        zh: '交换机ID'
                    }
                }
            }
        },
        'worker-data-disk': {
            mapping: 'workerDataDisk',
            vtype: 'boolean',
            unchanged:true,
            default:true,
            desc: {
                zh: '表示worker节点是否挂载数据盘'
            },
        },
        'worker-data-disks': {
            required:true,
            mapping: 'workerDataDisks',
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').CreateClusterBodyWorkerDataDisks,
            desc: {
                zh: `Worker数据盘类型、大小等配置的组合。该参数只有在挂载Worker节点数据盘时有效`
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
        // sdk无字段
        'worker-instance-type': {
            required: true,
            vtype: 'array',
            desc: {
                zh: 'Worker节点ECS规格类型代码'
            }
        },
    }
};