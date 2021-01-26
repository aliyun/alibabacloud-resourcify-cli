'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    en: 'Create a cluster node pools',
    zh: '为集群创建节点池'
  },
  options: {
    'auto-scaling': {
      mapping: 'CreateClusterNodePoolRequest.autoScaling',
      vtype: 'map',
      desc: {
        zh: '自动伸缩配置',
        en: ''
      },
      options: {
        'enable': {
          required: true,
          mapping: 'enable',
          vtype: 'boolean',
          default: false,
          desc: {
            zh: '是否启用自动伸缩',
            en: ''
          }
        },
        'max-instances': {
          mapping: 'maxInstances',
          vtype: 'number',
          desc: {
            zh: '自动伸缩组最大实例数',
            en: ''
          },
          attributes: {
            show: [
              {
                'auto-scaling.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'min-instances': {
          mapping: 'minInstances',
          vtype: 'number',
          desc: {
            zh: '自动伸缩组最小实例数',
            en: ''
          },
          attributes: {
            show: [
              {
                'auto-scaling.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'type': {
          mapping: 'type',
          vtype: 'string',
          choices: [
            '',
            'cpu',
            'gpu',
            'gpushare',
            'spot'
          ],
          desc: {
            zh: '自动伸缩类型，按照自动伸缩实例类型划分',
            en: ''
          },
          attributes: {
            show: [
              {
                'auto-scaling.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'is-bond-eip': {
          mapping: 'isBondEip',
          vtype: 'boolean',
          default: false,
          desc: {
            zh: '是否绑定EIP',
            en: ''
          },
          attributes: {
            show: [
              {
                'auto-scaling.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'eip-internet-charge-type': {
          mapping: 'eipInternetChargeType',
          vtype: 'string',
          choices: [
            '',
            'PayByBandwidth',
            'PayByTraffic',
          ],
          desc: {
            zh: 'EIP计费类型',
            en: ''
          },
          attributes: {
            show: [
              {
                'auto-scaling.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'eip-bandwidth': {
          mapping: 'eipBandwidth',
          vtype: 'number',
          desc: {
            zh: 'EIP带宽峰值',
            en: ''
          },
          attributes: {
            show: [
              {
                'auto-scaling.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        }
      }
    },
    'kubernetes-config': {
      required: true,
      mapping: 'CreateClusterNodePoolRequest.kubernetesConfig',
      vtype: 'map',
      desc: {
        zh: '集群相关配置',
        en: ''
      },
      options: {
        'cms-enabled': {
          mapping: 'cmsEnabled',
          vtype: 'boolean',
          default: false,
          desc: {
            zh: '是否在ECS节点上安装云监控，安装后可以在云监控控制台查看所创建ECS实例的监控信息，推荐开启',
            en: ''
          }
        },
        'cpu-policy': {
          mapping: 'cpuPolicy',
          vtype: 'string',
          choices: [
            '',
            'static',
            'none',
          ],
          desc: {
            zh: '节点CPU管理策略',
            en: ''
          }
        },
        'labels': {
          mapping: 'labels',
          vtype: 'array',
          subType: 'map',
          desc: {
            zh: '仅为 ECS 实例添加标签。标签键不可以重复，最大长度为128个字符；标签键和标签值都不能以“aliyun”、“acs:”开头，或包含“https://”、“http://”',
            en: ''
          },
          options: {
            'key': {
              mapping: 'key',
              vtype: 'string',
              desc: {
                zh: '标签key值',
                en: ''
              }
            },
            'value': {
              mapping: 'value',
              vtype: 'string',
              desc: {
                zh: '标签value值',
                en: ''
              }
            }
          }
        },
        'runtime': {
          required: true,
          mapping: 'runtime',
          vtype: 'string',
          desc: {
            zh: '容器运行时',
            en: ''
          }
        },
        'runtime-version': {
          required: true,
          mapping: 'runtimeVersion',
          vtype: 'string',
          desc: {
            zh: '容器运行时版本',
            en: ''
          }
        },
        'taints': {
          mapping: 'taints',
          vtype: 'array',
          subType: 'map',
          desc: {
            zh: '污点配置',
            en: ''
          },
          options: {
            'key': {
              mapping: 'key',
              vtype: 'string',
              desc: {
                zh: '污点key值',
                en: ''
              }
            },
            'value': {
              mapping: 'value',
              vtype: 'string',
              desc: {
                zh: '污点value值',
                en: ''
              }
            },
            'effect': {
              mapping: 'effect',
              vtype: 'string',
              choices: [
                '',
                'NoSchedule',
                'NoExecute',
                'PreferNoSchedule'
              ],
              desc: {
                zh: '调度策略',
                en: ''
              }
            }
          }
        },
        'user-data': {
          mapping: 'userData',
          vtype: 'string',
          desc: {
            zh: '节点自定义数据',
            en: ''
          }
        }
      }
    },
    'nodepool-info': {
      required: true,
      mapping: 'CreateClusterNodePoolRequest.nodepoolInfo',
      vtype: 'map',
      desc: {
        zh: '节点池配置',
        en: ''
      },
      options: {
        'name': {
          required: true,
          mapping: 'name',
          vtype: 'string',
          desc: {
            zh: '节点池名称',
            en: ''
          }
        },
        'resource-group-id': {
          mapping: 'resourceGroupId',
          vtype: 'string',
          desc: {
            zh: '节点池所在资源ID',
            en: ''
          }
        }
      }
    },
    'scaling-group': {
      required: true,
      mapping: 'CreateClusterNodePoolRequest.scalingGroup',
      vtype: 'map',
      desc: {
        zh: '节点池扩容组配置',
        en: ''
      },
      options: {
        'instance-charge-type': {
          required: true,
          mapping: 'instanceChargeType',
          vtype: 'string',
          choices: [
            'PrePaid',
            'PostPaid'
          ],
          default: 'PostPaid',
          desc: {
            zh: '节点池节点付费类型',
            en: ''
          }
        },
        'auto-renew': {
          mapping: 'autoRenew',
          vtype: 'boolean',
          default: true,
          desc: {
            zh: '节点池节点是否开启自动续费',
            en: ''
          },
          attributes: {
            show: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                }
              }
            ]
          }
        },
        'auto-renew-period': {
          mapping: 'autoRenewPeriod',
          vtype: 'number',
          desc: {
            zh: '节点池节点自动续费周期',
            en: ''
          },
          attributes: {
            show: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                },
                'scaling-group.auto-renew': {
                  type: 'equal',
                  value: true
                }
              }
            ],
            required: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                },
                'scaling-group.auto-renew': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'data-disks': {
          mapping: 'dataDisks',
          vtype: 'array',
          subType: 'map',
          desc: {
            zh: '节点池节点数据盘配置',
            en: ''
          },
          options: {
            'category': {
              mapping: 'category',
              vtype: 'string',
              choices: [
                'cloud',
                'cloud_efficiency',
                'cloud_ssd',
                'cloud_essd',
              ],
              default: 'cloud_efficiency',
              desc: {
                zh: '数据盘类型',
                en: ''
              }
            },
            'size': {
              mapping: 'size',
              vtype: 'number',
              default: 120,
              desc: {
                zh: '数据盘大小，单位为GiB。取值范围：[40,32768]',
                en: ''
              }
            },
            'encrypted': {
              mapping: 'encrypted',
              vtype: 'string',
              choices: [
                'true',
                'false'
              ],
              default: 'false',
              desc: {
                zh: '是否对数据盘加密',
                en: ''
              }
            },
            'auto-snapshot-policyId': {
              mapping: 'autoSnapshotPolicyId',
              vtype: 'string',
              desc: {
                zh: '选择自动快照策略ID，云盘会按照快照策略自动备份',
                en: ''
              }
            }
          }
        },
        'image-id': {
          mapping: 'imageId',
          vtype: 'string',
          desc: {
            zh: '自定义镜像ID',
            en: ''
          }
        },
        'instance-types': {
          required: true,
          mapping: 'instanceTypes',
          vtype: 'array',
          subType: 'string',
          desc: {
            zh: '实例规格',
            en: ''
          }
        },
        'key-pair': {
          mapping: 'keyPair',
          vtype: 'string',
          desc: {
            zh: '免密登录密钥对名称',
            en: ''
          }
        },
        'login-password': {
          mapping: 'loginPassword',
          vtype: 'string',
          desc: {
            zh: 'SSH登录密码。密码规则为8~30个字符，且至少同时包含三项（大小写字母、数字和特殊符号）',
            en: ''
          },
          attributes: {
            show: [
              {
                'scaling-group.key-pair': {
                  type: 'equal',
                  value: undefined
                }
              }
            ],
            required: [
              {
                'scaling-group.key-pair': {
                  type: 'equal',
                  value: undefined
                }
              }
            ]
          }
        },
        'period': {
          mapping: 'period',
          vtype: 'number',
          default: 1,
          desc: {
            zh: '节点池节点包年包月时长',
            en: ''
          },
          attributes: {
            show: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                }
              }
            ],
            required: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                }
              }
            ]
          }
        },
        'period-unit': {
          mapping: 'periodUnit',
          vtype: 'string',
          desc: {
            zh: '节点池节点付费周期',
            en: ''
          },
          attributes: {
            show: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                }
              }
            ],
            required: [
              {
                'scaling-group.instance-charge-type': {
                  type: 'equal',
                  value: 'PrePaid'
                }
              }
            ]
          }
        },
        'platform': {
          required: true,
          mapping: 'platform',
          vtype: 'string',
          choices: [
            'CentOS',
            'AliyunLinux',
            'Windows',
            'WindowsCore'
          ],
          default: 'AliyunLinux',
          desc: {
            zh: '操作系统发行版',
            en: ''
          }
        },
        'rds-instances': {
          mapping: 'rdsInstances',
          vtype: 'array',
          subType: 'string',
          desc: {
            zh: 'RDS实例ID',
            en: ''
          }
        },
        'spot-strategy': {
          mapping: 'spotStrategy',
          vtype: 'string',
          choices: [
            '',
            'NoSpot',
            'SpotWithPriceLimit',
            'SpotAsPriceGo'
          ],
          desc: {
            zh: '抢占式实例类型',
            en: ''
          }
        },
        'spot-price-limit': {
          mapping: 'spotPriceLimit',
          vtype: 'array',
          subType: 'map',
          desc: {
            zh: '当前单台抢占式实例规格市场价格区间配置',
            en: ''
          },
          options: {
            'instance-type': {
              mapping: 'instanceType',
              vtype: 'string',
              desc: {
                zh: '抢占式实例规格',
                en: ''
              }
            },
            'price-limit': {
              mapping: 'priceLimit',
              vtype: 'string',
              desc: {
                zh: '单台实例上限价格。单位：元/小时',
                en: ''
              }
            }
          }
        },
        'scaling-policy': {
          mapping: 'scalingPolicy',
          vtype: 'string',
          choices: [
            '',
            'release',
            'recycle'
          ],
          desc: {
            zh: '伸缩组模式',
            en: ''
          }
        },
        'security-group-id': {
          mapping: 'securityGroupId',
          vtype: 'string',
          desc: {
            zh: '安全组ID',
            en: ''
          }
        },
        'system-disk-category': {
          required: true,
          mapping: 'systemDiskCategory',
          vtype: 'string',
          choices: [
            'cloud_efficiency',
            'cloud_ssd',
            'cloud_essd'
          ],
          default: 'cloud_efficiency',
          desc: {
            zh: '节点系统盘类型',
            en: ''
          }
        },
        'system-disk-size': {
          required: true,
          mapping: 'systemDiskSize',
          vtype: 'number',
          desc: {
            zh: '节点系统盘大小，单位为GiB',
            en: ''
          }
        },
        'tags': {
          mapping: 'tags',
          vtype: 'array',
          subType: 'map',
          desc: {
            zh: '节点标签，为Kubernetes集群节点添加标签',
            en: ''
          },
          options: {
            'key': {
              mapping: 'key',
              vtype: 'string',
              desc: {
                zh: '标签的名称',
                en: ''
              }
            },
            'value': {
              mapping: 'value',
              vtype: 'string',
              desc: {
                zh: '标签值',
                en: ''
              }
            }
          }
        },
        'vswitch-ids': {
          required: true,
          mapping: 'vswitchIds',
          vtype: 'array',
          subType: 'string',
          desc: {
            zh: '虚拟交换机ID',
            en: ''
          }
        },
        'multi-az-policy': {
          mapping: 'multiAzPolicy',
          vtype: 'string',
          choices: [
            '',
            'PRIORITY',
            'COST_OPTIMIZED',
            'BALANCE'
          ],
          desc: {
            zh: '多可用区伸缩组ECS实例扩缩容策略',
            en: ''
          }
        },
        'on-demand-base-capacity': {
          mapping: 'onDemandBaseCapacity',
          vtype: 'number',
          desc: {
            zh: '伸缩组所需要按量实例个数的最小值，取值范围：[0,1000]。当按量实例个数少于该值时，将优先创建按量实例',
            en: ''
          }
        },
        'on-demand-percentage-above-base-capacity': {
          mapping: 'onDemandPercentageAboveBaseCapacity',
          vtype: 'number',
          desc: {
            zh: '伸缩组满足最小按量实例数（on_demand_base_capacity）要求后，超出的实例中按量实例应占的比例。取值范围：[0,100]',
            en: ''
          }
        },
        'spot-instance-pools': {
          mapping: 'spotInstancePools',
          vtype: 'number',
          desc: {
            zh: '指定可用实例规格的个数，伸缩组将按成本最低的多个规格均衡创建抢占式实例。取值范围：[1,10]',
            en: ''
          }
        },
        'spot-instance-remedy': {
          mapping: 'spotInstanceRemedy',
          vtype: 'boolean',
          desc: {
            zh: '是否开启补齐抢占式实例。开启后，当收到抢占式实例将被回收的系统消息时，伸缩组将尝试创建新的实例，替换掉将被回收的抢占式实例',
            en: ''
          }
        },
        'compensate-with-on-demand': {
          mapping: 'compensateWithOnDemand',
          vtype: 'boolean',
          desc: {
            zh: '如果因价格、库存等原因无法创建足够的抢占式实例，是否允许自动尝试创建按量实例满足ECS实例数量要求',
            en: ''
          },
          attributes: {
            show: [
              {
                'scaling-group.multi-az-policy': {
                  type: 'equal',
                  value: 'COST_OPTIMIZED'
                }
              }
            ],
            required: [
              {
                'scaling-group.multi-az-policy': {
                  type: 'equal',
                  value: 'COST_OPTIMIZED'
                }
              }
            ]
          }
        }
      }
    },
    'tee-config': {
      mapping: 'CreateClusterNodePoolRequest.teeConfig',
      vtype: 'map',
      desc: {
        en: '',
        zh: '加密计算集群配置'
      },
      options: {
        'tee-enable': {
          required: true,
          mapping: 'teeEnable',
          vtype: 'boolean',
          desc: {
            en: '',
            zh: '是否开启加密计算集群'
          }
        }
      }
    },
    'management': {
      mapping: 'CreateClusterNodePoolRequest.management',
      vtype: 'map',
      desc: {
        en: '',
        zh: '托管节点池配置'
      },
      options: {
        'enable': {
          required: true,
          mapping: 'enable',
          vtype: 'boolean',
          desc: {
            en: '',
            zh: '是否开启托管版节点池'
          }
        },
        'auto-repair': {
          mapping: 'autoRepair',
          vtype: 'boolean',
          desc: {
            en: '',
            zh: '自动修复'
          },
          attributes: {
            show: [
              {
                'management.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          }
        },
        'upgrade-config': {
          mapping: 'upgradeConfig',
          vtype: 'map',
          desc: {
            en: '',
            zh: '自动升级配置'
          },
          attributes: {
            show: [
              {
                'management.enable': {
                  type: 'equal',
                  value: true
                }
              }
            ]
          },
          options: {
            'auto-upgrade': {
              mapping: 'autoUpgrade',
              vtype: 'boolean',
              desc: {
                en: '',
                zh: '是否启用自动升级'
              }
            },
            'surge': {
              mapping: 'surge',
              vtype: 'number',
              desc: {
                en: '',
                zh: '额外节点数量'
              }
            },
            'surge-percentage': {
              mapping: 'surgePercentage',
              vtype: 'number',
              desc: {
                en: '',
                zh: '额外节点比例'
              },
              attributes: {
                show: [
                  {
                    'management.upgrade-config.surge': {
                      type: 'equal',
                      value: undefined
                    }
                  }
                ]
              }
            },
            'max-unavailable': {
              required: true,
              mapping: 'maxUnavailable',
              vtype: 'number',
              default: 1,
              desc: {
                en: '',
                zh: '最大不可用节点数量。取值范围：[1,1000]'
              }
            }
          }
        }
      }
    },
    'count': {
      mapping: 'CreateClusterNodePoolRequest.count',
      vtype: 'number',
      desc: {
        en: '',
        zh: '节点池节点数量'
      }
    }
  },
  args: [
    {
      name: 'clusterId',
      required: true,
      vtype: 'string',
      desc: {
        zh: '容器实例Id',
        en: ''
      }
    }
  ]
};

exports.run = async function (ctx) {
  let profile = await runtime.getConfigOption(ctx.profile);
  let { Config } = require('@alicloud/openapi-client');
  let config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type,
    readTimeout: 10000
  });
  let CreateClusterNodePoolRequest = require(`@alicloud/cs20151215`).CreateClusterNodePoolRequest;
  let request = new CreateClusterNodePoolRequest(ctx.mappingValue.CreateClusterNodePoolRequest);
  let client = new Client(config);
  let result;
  try {
    result = await client.createClusterNodePoolWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);

};