'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');

exports.cmdObj = {
    use: 'arc cs cluster delete',
    args: [
        {
            name: 'clusterId',
            variable: true,
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
    let DeleteClusterRequest = require(`@alicloud/cs20151215`).DeleteClusterRequest;
    let request = new DeleteClusterRequest({});
    let client = new Client(config);
    for (let id of argv._) {
        client.deleteClusterWithOptions(id,request, runtime.getRuntimeOption(argv)).then(result => {
            let data = JSON.stringify(result, null, 2);
            console.log(data);
        }).catch(e => {
            console.error(e.message);
        });
    }
};