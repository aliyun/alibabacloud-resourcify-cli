'use strict';

// TODO
exports.cmdObj = {
    use: 'arc cs cluster create-edge',
    flags: {
        'vpcid': {
            desc: {
                zh: '可空。如果不设置，系统会自动创建VPC，系统创建的VPC网段为192.168.0.0/16。VpcId和vswitchid只能同时为空或者同时都设置相应的值'
            }
        },
        region: {
            alias: 'r',
            required: true,
            desc: {
                zh: '集群所在地域ID',
            }
        },
        name: {
            desc: {
                zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。'
            }
        },
        'key-pair': {
            desc: {
                zh: 'key_pair名称，和login_pwd二选一。'
            },
        },
        'login-password': {
            desc: {
                zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号），和key_pair 二选一。'
            }
        },
        'snat-entry': {
            required: true,
            desc: {
                zh: `是否为网络配置SNAT：当已有VPC能访问公网环境时，设置为 false。当已有VPC不能访问公网环境时：设置为true，表示配置SNAT，此时可以访问公网环境。设置为false，表示不配置SNAT，此时不能访问公网环境。`
            }
        },
        'worker-system-disk-category': {
            required: true,
            desc: {
                zh: 'Worker节点系统盘类型'
            },
            choices: [
                'cloud_efficiency',
                'cloud_ssd'
            ]
        },
        'worker-system-disk-size': {
            required: true,
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
        'endpoint-public-access': {
            vtype: 'boolean',
            desc: {
                zh: '是否开启公网API Server, 边缘集群需开启公网访问'
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
            example: `[{"category":"cloud","size":"40","encrypted":"false"}]`
        },

        // TODO maplist类型输入问题，暂时以string输入json字符串
        tags: {
            desc: {
                zh: '给集群打tag标签：key：标签名称；value：标签值'
            }
        },
    }
};