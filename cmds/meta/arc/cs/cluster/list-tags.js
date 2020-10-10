'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster list-tags',
    desc: {
        zh: '查询可见的资源标签关系',
        en: `query tags that are attached to resources.`
    },
    options: {
        'resource-type': {
            mapping: 'resourceType',
            required: true,
            desc: {
                zh: '资源类型定义',
                en: `The type of the resource.`
            }
        },
        'next-token': {
            mapping: 'nextToken',
            desc: {
                zh: '下一个查询开始的Token',
                en: `The token used to start the next query.`
            }
        },
        'resource-ids': {
            mapping: 'resourceIds',
            desc: {
                zh: '要查询的集群ID列表',
                en: `The IDs of the resources to query.`
            }
        },
        tags: {
            mapping: 'tags',
            vtype: 'string',
            desc: {
                zh: '给集群打tag标签：key：标签名称；value：标签值',
                en: `The list of tags to query. This list is a JSON string that contains a maximum of 20 key-value pairs.`
            },
            example: `[{"key":"env","value","dev"},{"key":"dev", "value":"IT"}]`
        },
    }
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
    let ListTagResourcesRequest = require(`@alicloud/cs20151215`).ListTagResourcesRequest;
    let request = new ListTagResourcesRequest(argv._mappingValue);

    let client = new Client(config);
    let result;
    try {
        result = await client.listTagResourcesWithOptions(request, {}, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};