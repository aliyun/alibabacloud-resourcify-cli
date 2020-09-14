'use strict';

// TODO sdk不正确
let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs node attach-script',
    desc: {
        zh: '生成Kubernetes边缘托管版集群的节点接入脚本'
    },
    options: {
        arch:{
            desc:{
                zh:'节点CPU架构'
            },
            choices:[
                'amd64',
                'arm',
                'arm64'
            ]
        }
    },
    required: [
        'key',
        'value'
    ],
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

    if (argv['tags']) {
        let AttachInstancesBodyTags = require('@alicloud/cs20151215').AttachInstancesBodyTags;
        let tagsObj = new AttachInstancesBodyTags({});
        for (let value of argv['tags']) {
            let values = value.split(',');
            for (let data of values) {
                let pair = data.split('=');
                tagsObj[pair[0]] = pair[1];
            }
            body['tags'].push(tagsObj);
        }
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