'use strict';
// TODO 文档不全，暂停
exports.cmdObj = {
    use: 'arc cs cluster create-sandbox',
    flags: {
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
        'kubernetes-version': {
            desc: {
                zh: 'Kubernetes集群版本，默认最新版，仅支持1.14.6-aliyun.1及以上版本'
            }
        },
        'num-of-nodes': {
            required: true,
            vtype: 'number',
            desc: {
                zh: 'Worker节点数。范围是[0，100]'
            }
        },
        'pod-vswitch-ids': {
            required: true,
            vtype: 'array',
            desc: {
                zh: 'Pod使用的虚拟交换机的ID'
            }
        },
        'runtime': {
            require: true,
            desc: {
                zh: 'name：安全容器运行时的名称，目前支持Sandboxed-Container.runv，version：当前版本1.0.0'
            },
            example: `{"name":"Sandboxed-Container.runv","version":"1.0.0"}`
        },
        'snat-entry': {
            required: true,
            vtype: 'boolean',
            desc: {
                zh: `是否为网络配置SNAT：当已有VPC能访问公网环境时，设置为 false。当已有VPC不能访问公网环境时：设置为true，表示配置SNAT，此时可以访问公网环境。设置为false，表示不配置SNAT，此时不能访问公网环境。`
            }
        },
        'vpcid': {
            required: true,
            desc: {
                zh: `如果不设置，系统会自动创建VPC，系统创建的VPC网段为192.168.0.0/16
                vpcid和vswitch_ids只能同时为空或者同时都设置对应的值`
            }
        },
        'vswitch-ids': {
            required: true,
            type: 'array',
            desc: {
                zh: '交换机ID。List长度范围为 [1，3]'
            }
        },
        'worker-data-disks': {
            desc: {
                zh: `Worker数据盘类型、大小等配置的组合。该参数只有在挂载Worker节点数据盘时有效，包含以下参数：
                category：数据盘类型。取值范围：
                cloud：普通云盘。
                cloud_efficiency：高效云盘。
                cloud_ssd：SSD云盘。
                size：数据盘大小，单位为GiB。必须大于200
                encrypted:是否对数据盘加密，true|false`
            },
            example: `[{"category":"cloud","size":"40","encrypted":"false"}]`
        },

        'worker-instance-types': {
            required: true,
            vtype: 'array',
            desc: {
                zh: 'Worker节点ECS规格类型代码'
            }
        },
        // Tips:沙盒版集群必须为true
        'worker-data-disk': {
            vtype: 'boolean',
            desc: {
                zh: '表示worker节点是否挂载数据盘'
            },
        },

    }
};