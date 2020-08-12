'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster list-tags',
    desc: {
        zh: '查询可见的资源标签关系'
    },
    options: {
        'resource-type':{
            mapping:'resourceType',
            required:true,
            desc:{
                zh:'资源类型定义'
            }
        },
        'next-token':{
            mapping:'nextToken',
            desc:{
                zh:'下一个查询开始的Token'
            }
        },
        'resource-ids':{
            mapping:'resourceIds',
            desc:{
                zh:'要查询的集群ID列表'
            }
        },
        tags: {
            mapping:'tags',
            vtype: 'string',
            desc: {
                zh: '给集群打tag标签：key：标签名称；value：标签值'
            },
            example: `[{"key":"env","value","dev"},{"key":"dev", "value":"IT"}]`
        },
    }
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
    let ListTagResourcesRequest = require(`@alicloud/cs20151215`).ListTagResourcesRequest;
    let request = new ListTagResourcesRequest({});

    let ListTagResourcesQuery = require('@alicloud/cs20151215').ListTagResourcesQuery;
    let query = new ListTagResourcesQuery({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        query[flags[key].mapping] = argv[key];
    }
    request.query = query;

    let client = new Client(config);
    let result;
    try {
        result = await client.listTagResourcesWithOptions(request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};