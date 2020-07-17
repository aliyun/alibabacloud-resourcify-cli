'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs node delete',
    desc: {
        zh: '移除指定集群额外节点'
    },
    flags: {
        'release-node': {
            mapping: 'releaseNode',
            vtype: 'boolean',
            desc: {
                zh: '是否同时释放ECS'
            }
        },
        'drain-node': {
            mapping: 'drainNode',
            vtype: 'boolean',
            desc: {
                zh: '是否排空节点上的Pod'
            }
        },
        'nodes': {
            vtype: 'array',
            desc: {
                zh: '要移除的node_name数组'
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
    let RemoveClusterNodesRequest = require(`@alicloud/cs20151215`).RemoveClusterNodesRequest;
    let request = new RemoveClusterNodesRequest({});

    let RemoveClusterNodesBody = require('@alicloud/cs20151215').RemoveClusterNodesBody;
    let body = new RemoveClusterNodesBody({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        body[flags[key].mapping] = argv[key];
    }
    if (argv['nodes']) {
        let nodes = [];
        for (let value of argv['nodes']) {
            let RemoveClusterNodesBodyNodes = require('@alicloud/cs20151215').RemoveClusterNodesBodyNodes;
            let node = new RemoveClusterNodesBodyNodes({ nodeName: value });
            nodes.push(node);
        }
        body.nodes = nodes;
    }
    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.removeClusterNodesWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};