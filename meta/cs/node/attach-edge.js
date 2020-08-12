'use strict';
// TODO 数据不全
let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs node attach-edge',
    desc: {
        zh: '添加已有ENS节点至边缘托管集群'
    },
    options: {
        'is_edge_worker':{
            mapping:''
        },
        'instances': {
            mapping: 'instances',
            vtype: 'array',
            desc: {
                zh: '实例列表'
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
    let AttachInstancesRequest = require(`@alicloud/cs20151215`).AttachInstancesRequest;
    let request = new AttachInstancesRequest({});

    let AttachInstancesBody = require('@alicloud/cs20151215').AttachInstancesBody;
    let body = new AttachInstancesBody({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        body[flags[key].mapping] = argv[key];
    }

    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.attachInstancesWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};