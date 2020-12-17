'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: `生成Kubernetes边缘托管版集群的节点接入脚本
        该API返回唯一的可执行脚本。您获取脚本后，在已有节点上执行该脚本即可完成节点的接入。`,
    en: `The API returns the only executable script. After you obtain the script, execute the script on the existing node to complete the node access.`
  },
  options: {
    arch: {
      mapping: 'DescribeClusterAttachScriptsRequest.arch',
      desc: {
        zh: '节点CPU架构。支持的CPU架构包括:amd64、arm、arm64。默认amd64。当集群类型为边缘托管版时必填',
        en: `Node CPU architecture. Supported CPU architectures include: amd64, arm, arm64. The default is amd64. Required when the cluster type is edge hosting version.`
      },
      choices: [
        'amd64',
        'arm',
        'arm64'
      ]
    },
    'option': {
      mapping: 'DescribeClusterAttachScriptsRequest.options',
      mappingType: require(`@alicloud/cs20151215`).DescribeClusterAttachScriptsRequestOptions,
      vtype: 'map',
      desc: {
        zh: '节点的接入配置参数，当集群类型为边缘托管版时必填。',
        en: `Node access configuration parameters, required when the cluster type is edge hosting version.`
      },
      options: {
        'allowed-cluster-addons': {
          mapping: 'allowedClusterAddons',
          vtype: 'array',
          subType: 'string',
          desc: {
            zh: '组件名称列表',
            en: `The list of addon name`
          }
        },
        'enable-iptables': {
          mapping: 'enableIptables',
          vtype: 'boolean',
          desc: {
            zh: `是否开启iptables`,
            en: `Whether to open iptables`
          }
        },
        'flannel-iface': {
          mapping: 'flannelIface',
          desc: {
            zh: `flannel使用的网卡名。默认使用节点默认路由的网卡名。`,
            en: `The name of the network card used by flannel. The network card name of the node's default route is used by default.`
          }
        },
        'gpu-version': {
          mapping: 'gpuVersion',
          desc: {
            zh: `表示要接入的节点是否为GPU节点，默认为空。当前支持的GPU版本是Nvidia_Tesla_T4、Nvidia_Tesla_P4、Nvidia_Tesla_P100。`,
            en: `Indicates whether the node to be accessed is a GPU node. The default is empty. The GPU versions currently supported are Nvidia_Tesla_T4, Nvidia_Tesla_P4, Nvidia_Tesla_P100.`
          }
        },
        'manage-runtime': {
          mapping: 'manageRuntime',
          vtype: 'boolean',
          desc: {
            zh: `是否由edgeadm安装并检测Runtime，默认false。`,
            en: `Whether to install and detect Runtime by edgeadm, the default is false.`
          }
        },
        'node-name-override': {
          mapping: 'nodeNameOverride',
          desc: {
            zh: `设置节点名。
""（默认值，表示使用主机名。）
"*"（表示随机生成6位的字符串。）
"*.XXX"（表示随机生成6位字符串+XXX后缀。）`,
            en: `Set the node name.
"" (The default value means to use the host name.)
"*" (It means that a 6-digit string is randomly generated.)
"*.XXX" (It means that a 6-digit string + XXX suffix is randomly generated.)`
          }
        },
        'quiet': {
          mapping: 'quiet',
          desc: {
            zh: `是否使用静默模式安装。`,
            en: `Whether to use silent mode installation.`
          }
        }
      }
    }
  },
  args: [
    {
      name: 'clusterId',
      required: true
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
    type: profile.type
  });
  let DescribeClusterAttachScriptsRequest = require(`@alicloud/cs20151215`).DescribeClusterAttachScriptsRequest;
  let request = new DescribeClusterAttachScriptsRequest(ctx.mappingValue.DescribeClusterAttachScriptsRequest);


  let client = new Client(config);
  let result;
  try {
    result = await client.describeClusterAttachScriptsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};