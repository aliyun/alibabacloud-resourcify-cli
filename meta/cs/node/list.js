'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs node list',
    desc: {
        zh: '列举集群节点信息'
    },
    flags: {
        'page-size': {
            mapping: 'pageSize',
            desc: {
                zh: '分页大小'
            }
        },
        'page-number': {
            mapping: 'pageNumber',
            desc: {
                zh: '共计展示多少页'
            }
        },
        'nodepool-id': {
            mapping: 'nodepoolId',
            desc: {
                zh: '节点池ID'
            }
        },
        'state': {
            mapping: 'state',
            desc: {
                zh: '状态信息'
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
    let profile = await runtime.getConfigOption(argv);
    let { Config } = require('@alicloud/roa-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let DescribeClusterNodesRequest = require(`@alicloud/cs20151215`).DescribeClusterNodesRequest;
    let request = new DescribeClusterNodesRequest({});

    let DescribeClusterNodesQuery = require('@alicloud/cs20151215').DescribeClusterNodesQuery;
    let query = new DescribeClusterNodesQuery({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        query[flags[key].mapping] = argv[key];
    }
    request.query = query;

    let client = new Client(config);
    client.describeClusterNodesWithOptions(argv._[0], request, runtime.getRuntimeOption(argv)).then(result => {
        let data = JSON.stringify(result, null, 2);
        output.log(data);
    }).catch(e => {
        output.error(e.message);
    });
};