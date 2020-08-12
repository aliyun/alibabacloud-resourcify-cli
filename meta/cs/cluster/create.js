'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');
exports.cmdObj = {
    use: 'arc cs cluster create',
    desc: {
        en: 'Create a cluster',
        zh: '创建 k8s 集群'
    },
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
            default: 'Kubernetes'
        },
        name: {
            mapping: 'name',
            desc: {
                zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。'
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
                zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号）'
            },
            conflicts: [
                'key-pair'
            ]
        },
        'snat-entry': {
            required: true,
            mapping: 'snatEntry',
            vtype: 'boolean',
            desc: {
                zh: `是否为网络配置SNAT：当已有VPC能访问公网环境时，设置为 false。当已有VPC不能访问公网环境时：设置为true，表示配置SNAT，此时可以访问公网环境。设置为false，表示不配置SNAT，此时不能访问公网环境。`
            }
        },
        'worker-system-disk-category': {
            required: true,
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
            required: true,
            mapping: 'workerSystemDiskSize',
            vtype: 'number',
            desc: {
                zh: 'Worker节点系统盘大小，单位为GiB'
            }
        },
        'container-cidr': {
            mapping: 'containerCidr',
            dependency: true,
            desc: {
                zh: '容器网段，不能和VPC网段冲突。当选择系统自动创建VPC时，默认使用172.16.0.0/16网段。当创建flannel网络类型的集群时，该字段为必填'
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
        'endpoint-public-access': {
            mapping: 'endpointPublicAccess',
            vtype: 'boolean',
            desc: {
                zh: '是否开启公网API Server'
            }
        },
        'proxy-mode': {
            mapping: 'proxyMode',
            desc: {
                zh: 'kube-proxy代理模式,默认为iptables'
            },
            choices: [
                'iptables',
                'ipvs'
            ]
        },
        'security-group-id': {
            mapping: 'securityGroupId',
            desc: {
                zh: '指定集群ECS实例所属于的安全组ID'
            },
            sufficient: function (val) {
                let optList = {};
                if (!val) {
                    optList['is-enterprise'] = false;
                }
                return optList;
            }
        },
        'service-cidr': {
            mapping: 'serviceCidr',
            desc: {
                zh: 'Service网络的网段，不能和VPC网段及Pod网络网段冲突。当选择系统自动创建VPC时，默认使用172.19.0.0/20网段'
            }
        },
        'timeout-mins': {
            mapping: 'timeoutMins',
            vtype: 'number',
            desc: {
                zh: '集群资源栈创建超时时间，以分钟为单位，默认值 60'
            }
        },
        'vpcid': {
            required: true,
            mapping: 'vpcid',
            desc: {
                zh: 'vpcId和vswitchid只能同时都设置对应的值'
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
        'worker-data-disk': {
            mapping: 'workerDataDisk',
            vtype: 'boolean',
            desc: {
                zh: '表示worker节点是否挂载数据盘'
            },
            sufficient: function (val) {
                let optList = {};
                if (val) {
                    optList['worker-data-disks'] = true;
                }
                return optList;
            }
        },
        'worker-data-disks': {
            mapping: 'workerDataDisks',
            dependency: true,
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
        'cpu-policy': {
            mapping: 'cpuPolicy',
            desc: {
                zh: 'CPU策略。集群版本为1.12.6及以上版本支持static 和 none两种策略。默认为none'
            }
        },
        'runtime': {
            mapping: 'runtime',
            vtype: 'map',
            desc: {
                zh: '容器运行时，一般为docker，包括2个信息：name和version'
            },
            example: `name=docker,version=19.03.5`,
            options: {
                name: {
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
        platform: {
            mapping: 'platform',
            desc: {
                zh: '运行pod的主机的平台架构'
            }
        },
        'os-type': {
            mapping: 'osType',
            desc: {
                zh: '运行pod的主机的操作系统类型'
            }
        },
        'kubernetes-version': {
            mapping: 'kubernetesVersion',
            desc: {
                zh: 'Kubernetes集群版本，默认最新版'
            }
        },
        'deletion-protection': {
            mapping: 'deletionProtection',
            vtype: 'boolean',
            desc: {
                zh: '是否开启集群删除保护，防止通过控制台或API误删除集群'
            }
        },
        'master-system-disk-category': {
            required: true,
            mapping: 'masterSystemDiskCategory',
            desc: {
                zh: 'Master节点系统盘类型'
            },
            choices: [
                'cloud_efficiency',
                'cloud_ssd'
            ]
        },
        'master-system-disk-size': {
            required: true,
            mapping: 'masterSystemDiskSize',
            vtype: 'number',
            desc: {
                zh: 'Master节点系统盘大小，单位为GiB'
            }
        },
        'num-of-nodes': {
            required: true,
            mapping: 'numOfNodes',
            vtype: 'number',
            desc: {
                zh: 'Worker节点数。范围是[0，100]'
            },
            validate: function (val) {
                if (val < 0 || val > 100) {
                    return false;
                }
                return true;
            }
        },
        'master-instance-types': {
            required: true,
            mapping: 'masterInstanceTypes',
            vtype: 'array',
            subType: 'string',
            desc: {
                zh: 'Master节点ECS规格类型代码'
            },
            options: {
                element: {
                    desc: {
                        zh: 'ECS规格类型代码'
                    }
                }
            }
        },
        'master-vswitch-ids': {
            required: true,
            mapping: 'masterVswitchIds',
            vtype: 'array',
            maxindex: 3,
            subType: 'string',
            desc: {
                zh: 'Master节点交换机ID列表，交换机个数取值范围为1~3。为确保集群的高可用性，推荐您选择3个交换机，且分布在不同的可用区。'
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
        'worker-vswitch-ids': {
            required: true,
            mapping: 'workerVswitchIds',
            vtype: 'array',
            maxindex: 3,
            subType: 'string',
            desc: {
                zh: 'Worker节点的虚拟交换机ID列表'
            },
            options: {
                element: {
                    desc: {
                        zh: '交换机ID'
                    }
                }
            }
        },
        'ssh-flags': {
            mapping: 'sshFlags',
            vtype: 'boolean',
            desc: {
                zh: '是否开放公网SSH登录'
            }
        },
        'node-port-range': {
            mapping: 'nodePortRange',
            desc: {
                zh: '节点服务端口。取值范围为[30000，65535]'
            },
            example: `30000-32767`
        },
        'master-instance-charge-type': {
            mapping: 'masterInstanceChargeType',
            desc: {
                zh: 'Master节点付费类型'
            },
            choices: [
                'PrePaid',
                'PostPaid'
            ],
            sufficient: function (val) {
                let optList = {};
                if (val === 'PrePaid') {
                    optList['master-period'] = true;
                    optList['master-period-unit'] = true;
                    optList['master-auto-renew'] = true;
                }
                return optList;
            }
        },

        'master-period': {
            mapping: 'masterPeriod',
            vtype: 'number',
            dependency: true,
            desc: {
                zh: '包年包月时长，当master_instance_charge_type取值为PrePaid时才生效且为必选值，取值范围： PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”，“6”，“12”}'
            },
            choices: [
                1,
                2,
                3,
                6,
                12
            ]
        },
        'master-auto-renew': {
            mapping: 'masterAutoRenew',
            vtype: 'boolean',
            dependency: true,
            desc: {
                zh: 'Master节点是否自动续费，当master_instance_charge_type取值为PrePaid时才生效'
            },
            sufficient: function (val) {
                let optList = {};
                if (val) {
                    optList['master-auto-renew-period'] = true;
                }
                return optList;
            }
        },
        'master-auto-renew-period': {
            mapping: 'masterAutoRenewPeriod',
            vtype: 'number',
            dependency: true,
            desc: {
                zh: 'Master节点自动续费周期，当选择预付费和自动续费时才生效，且为必选值'
            }
        },
        'master-period-unit': {
            mapping: 'masterPeriodUnit',
            dependency: true,
            desc: {
                zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位'
            }
        },
        'master-count': {
            mapping: 'masterCount',
            vtype: 'number',
            desc: {
                zh: 'Master实例个数'
            },
            choices: [
                3,
                5
            ]
        },
        'pod-vswitch-ids': {
            mapping: 'podVswitchIds',
            vtype: 'array',
            dependency: true,
            subType: 'string',
            desc: {
                zh: 'Pod的虚拟交换机列表，在ENI多网卡模式下，需要传额外的vswitchid给addon。当创建terway网络类型的集群时，该字段为必填。'
            },
            options: {
                element: {
                    desc: {
                        zh: '交换机ID'
                    }
                }
            }
        },
        'node-cidr-mask': {
            mapping: 'nodeCidrMask',
            desc: {
                zh: '节点网络的网络前缀'
            }
        },
        tags: {
            mapping: 'tags',
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').CreateClusterBodyTags,
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
        'addons': {
            vtype: 'array',
            subType: 'map',
            mappingType: require('@alicloud/cs20151215').CreateClusterBodyAddons,
            desc: {
                zh: `Kubernetes集群的addon插件的组合
网络插件：包含Flannel和Terway网络插件，二选一。
    当选择flannel类型网络时："container-cidr"为必传参数，且addons值必须包含flannel，例如:[{"name":"flannel"}]。
    当选择terway类型网络时："pod-vswitch-ids"为必传参数，且addons值必须包含terway-eni,例如： [{"name": "terway-eni"}]。
日志服务：可选，如果不开启日志服务时，将无法使用集群审计功能。
Ingress：默认开启安装Ingress组件nginx-ingress-controller`
            },
            example: `name=flannel name=csi-plugin name=csi-provisioner name=nginx-ingress-controller,disabled=true`,
            sufficient: function (val) {
                let optList = {
                    'container-cidr': false,
                    'pod-vswitch-ids': false
                };
                for (let value of val) {
                    if (value.name === 'flannel') {
                        optList['container-cidr'] = true;
                    }
                    if (value.name === 'terway') {
                        optList['pod-vswitch-ids'] = true;
                    }
                }
                return optList;
            },
            options: {
                name: {
                    required: true,
                    desc: {
                        zh: 'addon插件名称'
                    }
                },
                disable: {
                    vtype: 'boolean',
                    desc: {
                        zh: '取值为空时默认取最新版本'
                    }
                },
                config: {
                    desc: {
                        zh: '取值为空时表示无需配置'
                    }
                }
            }
        },
        'private-zone': {
            mapping: 'privateZone',
            desc: {
                zh: '是否开启PrivateZone用于服务发现'
            },
            choices: [
                'true',
                'false'
            ]
        },
        'cluster-profile': {
            mapping: 'profile',
            desc: {
                zh: '边缘集群标识，默认取值为Edge。当创建集群类型为边缘托管版时，该参数必填'
            }
        },
        'is-enterprise': {
            mapping: 'isEnterpriseSecurityGroup',
            vtype: 'boolean',
            dependency: true,
            desc: {
                zh: '是否创建企业安全组'
            }
        }
    },
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
    let CreateClusterRequest = require(`@alicloud/cs20151215`).CreateClusterRequest;
    let request = new CreateClusterRequest({});
    let CreateClusterBody = require('@alicloud/cs20151215').CreateClusterBody;
    let body = new CreateClusterBody(argv._mappingValue);

    request.body = body;
    let client = new Client(config);
    let result;
    try {
        result = await client.createClusterWithOptions(request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};

