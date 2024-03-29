'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');
const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      short: {
        zh: '生成Kubernetes边缘托管版集群的节点接入脚本',
        en: 'Generate Kubernetes edge managed cluster node endpoint script'
      },
      desc: {
        zh: `生成Kubernetes边缘托管版集群的节点接入脚本
            该API返回唯一的可执行脚本。您获取脚本后，在已有节点上执行该脚本即可完成节点的接入。`,
        en: `The API returns the only executable script. After you obtain the script, execute the script on the existing node to complete the node access.`
      },
      options: {
        arch: {
          mapping: 'DescribeClusterAttachScriptsRequest.arch',
          vtype: 'string',
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
        'nodepool-id': {
          mapping: 'DescribeClusterAttachScriptsRequest.nodepoolId',
          vtype: 'string',
          desc: {
            zh: '节点池ID',
            en: `nodepool Id`
          }
        },
        'format-disk': {
          mapping: 'DescribeClusterAttachScriptsRequest.formatDisk',
          vtype: 'boolean',
          desc: {
            zh: '数据盘挂载',
            // TODO
            en: ``
          }
        },
        'keep-instance-name': {
          mapping: 'DescribeClusterAttachScriptsRequest.keepInstanceName',
          vtype: 'boolean',
          desc: {
            zh: '保留实例名称',
            en: `Keep instance name`
          }
        },
        'rds-instances': {
          mapping: 'DescribeClusterAttachScriptsRequest.rdsInstances',
          vtype: 'array',
          subType: 'string',
          desc: {
            zh: 'RDS白名单',
            // TODO
            en: ``
          }
        },
        'option': {
          mapping: 'DescribeClusterAttachScriptsRequest.options',
          vtype: 'string',
          desc: {
            zh: '边缘托管版集群节点的接入配置',
            en: `Node access configuration parameters`
          }
        }
      },
      args: [
        {
          name: 'clusterId',
          required: true
        }
      ]
    });
  }

  async run(ctx) {
    const profile = await runtime.getConfigOption(ctx.profile);
    const { Config } = require('@alicloud/openapi-client');
    const config = new Config({
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      securityToken: profile.sts_token,
      regionId: profile.region,
      type: profile.type
    });
    const DescribeClusterAttachScriptsRequest = require(`@alicloud/cs20151215`).DescribeClusterAttachScriptsRequest;
    const request = new DescribeClusterAttachScriptsRequest(ctx.mappingValue.DescribeClusterAttachScriptsRequest);

    const client = new Client(config);
    let result = await client.describeClusterAttachScriptsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());

    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
