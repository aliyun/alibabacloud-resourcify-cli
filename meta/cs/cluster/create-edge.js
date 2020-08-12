'use strict';

// TODO
exports.cmdObj = {
    use: 'arc cs cluster create-edge',
    options: {
        region: {
            mapping: 'regionId',
            alias: 'r',
            hide: true,
            desc: {
                zh: '集群所在地域ID',
            }
        },
        'cluster-type': {
            mapping: 'clusterType',
            unchanged: true,
            default: 'ManagedKubernetes'
        },
        'cluster-profile': {
            mapping: 'profile',
            unchanged: true,
            default: 'Edge'
        },
        'key-pair': {
            required:true,
            desc: {
                zh: 'key_pair名称，和login_pwd二选一。'
            },
            conflicts:[
                'login-password'
            ]
        },
        'login-password': {
            required:true,
            desc: {
                zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号），和key_pair 二选一。'
            },
            conflicts:[
                'key-pair'
            ]
        },
        name: {
            desc: {
                zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。'
            }
        },
        'num-of-nodes': {
            vtype: 'number',
            desc: {
                zh: 'Worker节点数。范围是[0，300]'
            }
        },
        'snat-entry': {
            vtype: 'boolean',
            desc: {
                zh: `是否为网络配置SNAT。如果是自动创建VPC必须设置为true。如果使用已有VPC则根据是否具备出网能力来设置`
            }
        },
        // 存疑，比较文档与sdk
        'vswitch-ids': {
            vtype: 'array',
            desc: {
                zh: '交换机ID。长度范围为 [1，3]'
            }
        },
        'worker-system-disk-category': {
            desc: {
                zh: 'Worker节点系统盘类型'
            },
            choices: [
                'cloud_efficiency',
                'cloud_ssd'
            ]
        },
        'worker-system-disk-size': {
            vtype: 'number',
            desc: {
                zh: 'Worker节点系统盘大小，单位为GiB'
            }
        },
        'container-cidr': {
            desc: {
                zh: '容器网段，不能和VPC网段冲突。当选择系统自动创建VPC时，默认使用172.16.0.0/16网段。当创建flannel网络类型的集群时，该字段为必填'
            }
        },
        'cloud-monitor-flags': {
            vtype: 'boolean',
            desc: {
                zh: '是否安装云监控插件'
            }
        },
        'disable-rollback': {
            vtype: 'boolean',
            desc: {
                zh: '失败是否回滚'
            }
        },
        'proxy-mode': {
            desc: {
                zh: 'kube-proxy代理模式,默认为iptables'
            },
            choices: [
                'iptables',
                'ipvs'
            ]
        },
        'endpoint-public-access': {
            vtype: 'boolean',
            desc: {
                zh: '是否开启公网API Server, 边缘集群需开启公网访问'
            }
        },
        'service-cidr': {
            desc: {
                zh: 'Service网络的网段，不能和VPC网段及Pod网络网段冲突。当选择系统自动创建VPC时，默认使用172.19.0.0/20网段'
            }
        },
        'timeout-mins': {
            vtype: 'number',
            desc: {
                zh: '集群资源栈创建超时时间，以分钟为单位，默认值 60'
            }
        },
        'vpcid': {
            desc: {
                zh: '可空。如果不设置，系统会自动创建VPC，系统创建的VPC网段为192.168.0.0/16。VpcId和vswitchid只能同时为空或者同时都设置相应的值'
            }
        },
        'worker-data-disk': {
            vtype: 'boolean',
            desc: {
                zh: '表示worker节点是否挂载数据盘'
            }
        },
        'worker-data-disks': {
            desc: {
                zh: `Worker数据盘类型、大小等配置的组合。该参数只有在挂载Worker节点数据盘时有效，包含以下参数：
                category：数据盘类型。取值范围：
                cloud：普通云盘。
                cloud_efficiency：高效云盘。
                cloud_ssd：SSD云盘。
                size：数据盘大小，单位为GiB。
                encrypted:是否对数据盘加密，true|false`
            },
            sub: {
                category: {
                    vtype: 'string'
                },
                size: {
                    vtype: 'number'
                },
                encrypted: {
                    vtype: 'string'
                }
            },
            example: `category=cloud,size=40,encrypted=false`
        },
        required: [
            'name',
            'num-of-nodes',
            'snat-entry',
            'vswitch-ids',
            'worker-system-disk-category',
            'worker-system-disk-size'
        ],
        conflicts: [
            {
                required: true,
                flags: [
                    'key-pair',
                    'login-password'
                ]
            }
        ],
    }
};