'use strict';

const { default: Credential, Config } = require('@alicloud/credentials');
const { RuntimeOptions } = require('@alicloud/tea-util');
const cliConfig = require('./config.js');


exports.getConfigOption = async function (args) {
    let name;
    if (args.profile) {
        name = args.profile;
    }
    cliConfig.getProfile(name);
    let profile = cliConfig.profile;
    profile.region = args.region || profile.region;
    let config;
    switch (profile.mode) {
        case 'AK':
            config = new Config({
                type: 'access_key',
                accessKeyId: profile.access_key_id,
                accessKeySecret: profile.access_key_secret
            });
            break;
        case 'StsToken':
            config = new Config({
                type: 'sts',
                accessKeyId: profile.access_key_id,
                accessKeySecret: profile.access_key_secret,
                securityToken: profile.sts_token
            });
            break;
        case 'EcsRamRole':
            config = new Config({
                type: 'ecs_ram_role',
                accessKeyId: profile.access_key_id,
                accessKeySecret: profile.access_key_secret,
                securityToken: profile.sts_token
            });
            break;
    }
    const cred = new Credential(config);
    profile.type = config.type;
    profile.access_key_id = await cred.getAccessKeyId();
    profile.access_key_secret = await cred.getAccessKeySecret();
    profile.sts_token = await cred.getSecurityToken();
    return profile;
};

exports.getRuntimeOption = function (args) {
    return new RuntimeOptions({});
};