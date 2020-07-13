'use strict';

// const runtime=require('');
let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');
exports.cmdObj = {
    use: 'arc cs cluster create',
    long: {
        en: 'Create a cluster',
        zh: '创建 k8s 集群'
    },
    flags: {
        region: {
            mapping: 'regionId',
            alias: 'r',
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
            vtype: 'boolean',
            desc: {
                zh: `是否为网络配置SNAT：当已有VPC能访问公网环境时，设置为 false。当已有VPC不能访问公网环境时：设置为true，表示配置SNAT，此时可以访问公网环境。设置为false，表示不配置SNAT，此时不能访问公网环境。`
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
        'endpoint-public-access': {
            vtype: 'boolean',
            desc: {
                zh: '是否开启公网API Server'
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
        'security-group-id': {
            desc: {
                zh: '指定集群ECS实例所属于的安全组ID'
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
                zh: 'vpcId和vswitchid只能同时都设置对应的值'
            }
        },
        'worker-auto-renew': {
            vtype: 'boolean',
            desc: {
                zh: '是否开启Worker节点自动续费'
            }
        },
        'worker-auto-renew-period': {
            vtype: 'number',
            desc: {
                zh: 'Worker节点自动续费周期，当选择预付费和自动续费时才生效，'
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
        'worker-instance-charge-type': {
            desc: {
                zh: 'Worker节点付费类型'
            },
            choices: [
                'PrePaid',
                'PostPaid'
            ]
        },
        'worker-period': {
            vtype: 'number',
            desc: {
                zh: '包年包月时长，当worker_instance_charge_type取值为PrePaid时才生效且为必选值，取值范围：PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”， “6”， “12”}'
            }
        },
        'worker-period-unit': {
            desc: {
                zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位'
            }
        },
        'worker-instance-types': {
            vtype: 'array',
            desc: {
                zh: 'Worker节点ECS规格类型代码'
            }
        },
        'cpu-policy': {
            desc: {
                zh: 'CPU策略。集群版本为1.12.6及以上版本支持static 和 none两种策略。默认为none'
            }
        },
        'runtime': {
            desc: {
                zh: '容器运行时，一般为docker，包括2个信息：name和version'
            },
            example: `{"name":"docker","version":"19.03.5"}`
        },
        platform: {
            desc: {
                zh: '运行pod的主机的平台架构'
            }
        },
        'os-type': {
            desc: {
                zh: '运行pod的主机的操作系统类型'
            }
        },
        'kubernetes-version': {
            desc: {
                zh: 'Kubernetes集群版本，默认最新版'
            }
        },
        'deletion-protection': {
            vtype: 'boolean',
            desc: {
                zh: '是否开启集群删除保护，防止通过控制台或API误删除集群'
            }
        },
        'master-system-disk-category': {
            desc: {
                zh: 'Master节点系统盘类型'
            },
            choices: [
                'cloud_efficiency',
                'cloud_ssd'
            ]
        },
        'master-system-disk-size': {
            vtype: 'number',
            desc: {
                zh: 'Master节点系统盘大小，单位为GiB'
            }
        },
        'num-of-nodes': {
            vtype: 'number',
            desc: {
                zh: 'Worker节点数。范围是[0，100]'
            }
        },
        'master-instance-types': {
            vtype: 'array',
            desc: {
                zh: 'Master节点ECS规格类型代码'
            }
        },
        'master-vswitch-ids': {
            vtype: 'array',
            desc: {
                zh: 'Master节点交换机ID列表，交换机个数取值范围为1~3。为确保集群的高可用性，推荐您选择3个交换机，且分布在不同的可用区。'
            }
        },
        'worker-vswitch-ids': {
            vtype: 'array',
            desc: {
                zh: 'Worker节点的虚拟交换机ID列表'
            }
        },
        'ssh-flags': {
            vtype: 'boolean',
            desc: {
                zh: '是否开放公网SSH登录'
            }
        },
        'node-port-range': {
            desc: {
                zh: '节点服务端口。取值范围为[30000，65535]'
            }
        },
        'master-instance-charge-type': {
            desc: {
                zh: 'Master节点付费类型'
            },
            choices: [
                'PrePaid',
                'PostPaid'
            ]
        },

        'master-period': {
            vtype: 'number',
            desc: {
                zh: '包年包月时长，当master_instance_charge_type取值为PrePaid时才生效且为必选值，取值范围： PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”，“6”，“12”}'
            }
        },
        'master-auto-renew': {
            vtype: 'boolean',
            desc: {
                zh: 'Master节点是否自动续费，当master_instance_charge_type取值为PrePaid时才生效'
            }
        },
        'master-auto-renew-period': {
            vtype: 'number',
            desc: {
                zh: 'Master节点自动续费周期，当选择预付费和自动续费时才生效，且为必选值'
            }
        },
        'master-period-unit': {
            desc: {
                zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位'
            }
        },
        'master-count': {
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
            desc: {
                zh: 'Pod的虚拟交换机列表，在ENI多网卡模式下，需要传额外的vswitchid给addon。当创建terway网络类型的集群时，该字段为必填。'
            }
        },
        // TODO 数据类型未确认
        'node-cidr-mask': {
            desc: {
                zh: '节点网络的网络前缀'
            }
        },
        // TODO maplist类型输入问题，暂时以string输入json字符串
        tags: {
            desc: {
                zh: '给集群打tag标签：key：标签名称；value：标签值'
            }
        },
        'addons': {
            desc: {
                zh: `Kubernetes集群的addon插件的组合
                addons的参数：
                name：必填，addon插件的名称。
                version：可选，取值为空时默认取最新版本。
                config：可选，取值为空时表示无需配置。
                网络插件：包含Flannel和Terway网络插件，二选一。
                当选择flannel类型网络时："container-cidr"为必传参数，且addons值必须包含flannel，例如:[{"name":"flannel"}]。
                当选择terway类型网络时："pod-vswitch-ids"为必传参数，且addons值必须包含terway-eni,例如： [{"name": "terway-eni"}]。
                日志服务：可选，如果不开启日志服务时，将无法使用集群审计功能。
                Ingress：默认开启安装Ingress组件nginx-ingress-controller`
            },
            example: `[{"name":"flannel"},{"name":"flexvolume"},{"name":"alicloud-disk-controller"},{"name":"logtail-ds","config":"{"IngressDashboardEnabled":"true"}"},{"name":"nginx-ingress-controller","config":"{"IngressSlbNetworkType":"internet"}"}]`
        },
        // 移除
        taints: {},
    },
    required: [
        'region',
        'snat-entry',
        'worker-vswitch-ids',
        'master-vswitch-ids',
        'master-instance-types',
        'num-of-nodes',
        'master-system-disk-size',
        'master-system-disk-category',
        'worker-instance-types',
        'vpcid',
        'worker-system-disk-size',
        'worker-system-disk-category'
    ]
};

exports.validate = function (argv) {
    if (argv['key-pair'] && argv['login-password']) {
        return `Only one option can be set for options '--key-pair' and 'login-password'`;
    }
    if (argv['num-of-nodes']) {
        if (argv['num-of-nodes'] > 100 || argv['num-of-nodes'] < 1) {
            return `option '--num-of-nodes' can range of 1-100`;
        }
    }
    if (argv['master-instance-charge-type'] && argv['master-instance-charge-type'] === 'PrePaid') {
        if (!argv['master-period']) {
            return `When ‘master-instance-charge-type=PrePaid’, ‘--master-period’ is required`;
        } else {
            if (![1, 2, 3, 6, 12].includes(argv['master-period'])) {
                return `--master-period optional values are [1, 2, 3, 6, 12]`;
            }
        }
        if (!argv['master-period-unit']) {
            return `When ‘--master-instance-charge-type=PrePaid’, ‘--master-period-unit’ is required`;
        }
        if (argv['master-auto-renew']) {
            if (!argv['master-auto-renew-period']) {
                return `When '--master-instance-charge-type=PrePaid' and '--master-auto-renew=true', '--master-auto-renew-period' is required`;
            }
        }
    }
    if (argv['worker-instance-charge-type'] && argv['worker-instance-charge-type'] === 'PrePaid') {
        if (!argv['master-period']) {
            return `When worker-instance-charge-type=PrePaid’, ‘--worker-period’ is required`;
        }
        if (!argv['worker-period-unit']) {
            return `When worker-instance-charge-type=PrePaid’, ‘--worker-period-unit’ is required`;
        }
        if (argv['worker-auto-renew']) {
            if (!argv['worker-auto-renew-period']) {
                return `When '--worker-instance-charge-type=PrePaid' and '--worker-auto-renew=true', '--worker-auto-renew-period' is required`;
            }
        }
    }
    return '';
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption(argv);
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
    let body = new CreateClusterBody({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        body[flags[key].mapping] = argv[key];
    }
    request.body = body;
    let client = new Client(config);

    client.createClusterWithOptions(request, runtime.getRuntimeOption(argv)).then(result => {
        let data = JSON.stringify(result, null, 2);
        output.result = data;
    }).catch(e => {
        output.error = e;
    });
};

