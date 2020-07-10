'use strict';

const { default: Credential, Config } = require('@alicloud/credentials');
const { RuntimeOptions } = require('@alicloud/tea-util');
const { getProfile } = require('./config.js');


exports.getConfigOption=async function (args) {
    let name;
    if (args.profile) {
        name = args.profile;
    }
    let {profile} = getProfile(name);
    if (!profile) {
        profile = {};
        profile.access_key_id = process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID;
        profile.access_key_secret = process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE;
        profile.region = 'cn-hangzhou';
    }
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
    profile.type=config.type;
    profile.access_key_id = await cred.getAccessKeyId();
    profile.access_key_secret = await cred.getAccessKeySecret();
    profile.sts_token = await cred.getSecurityToken();
    return profile;
};

exports.getRuntimeOption=function (args){
    return new RuntimeOptions({});
};