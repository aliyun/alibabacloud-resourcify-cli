'use strict';

const path = require('path');
const { default: Credential, Config } = require('@alicloud/credentials');
const { RuntimeOptions } = require('@alicloud/tea-util');
const { getProfile } = require('./config.js');
let paramRequest;
module.exports = async function (cmds, cmd, args) {
    let processFilePath = path.join(__dirname, 'meta');
    if (!cmd.mapping) {
        processFilePath = path.join(processFilePath, ...cmds);
        processFilePath += '.js';
        const { Run } = require(processFilePath);
        Run(cmd, args);
        return;
    }

    let [sdk, actionCode] = cmd.mapping.split('/');
    let { default: Client } = require(`@alicloud/${sdk}`);
    let actionRequest = require(`@alicloud/${sdk}`)[`${actionCode}Request`];
    let action = actionCode.replace(/^./, s => s.toLowerCase());
    if (!cmd.configPackage || cmd.configPackage === 'self') {
        cmd.configPackage = `@alicloud/${sdk}`;
    }
    let { Config } = require(cmd.configPackage);
    const profile = await getConfigOption(args);
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region
    });
    let request = new actionRequest({
    });
    // 处理来自options的参数
    const optionParams = cmd.param;
    for (const param in optionParams) {
        if (!args[param]) {
            continue;
        }
        if (optionParams[param].param && optionParams[param].vType === 'list') {
            paramRequest = require(`@alicloud/${sdk}`)[`${actionCode}Request${optionParams[param].mapping}`];
            args[param] = transParamList(optionParams[param], args);
        }

        request[optionParams[param].mapping] = args[param];

    }
    //处理来自args的参数
    const argsParams = cmd.args;
    let argsIndex = 0;
    for (const param in argsParams) {
        if (param.startsWith('_')) {
            continue;
        }
        if (!args._[argsIndex]) {
            break;
        }
        switch (argsParams[param]) {
            case 'jsonList':
                request[param] = JSON.stringify(args._);
                break;
            case 'string':
                request[param] = args._[argsIndex];
        }
        argsIndex++;
    }
    let client = new Client(config);
    let runtime = new RuntimeOptions({
    });
    client[action](request, runtime).then(result => {
        let data = JSON.stringify(result, null, 2);
        console.log(data);
    }).catch(e => {
        console.log(e.message);
    });
};

function transParamList(option, args) {
    let params = option.param;
    let index = 0;
    let tempList = new Array();

    for (; ; index++) {
        let next = false;
        tempList[index] = new paramRequest({});
        for (var param in params) {
            if (args[param][index]) {
                tempList[index][params[param].mapping] = args[param][index];
                next = true;
            }
        }
        if (!next) {
            break;
        }
    }
    return tempList.slice(0, index);
}

async function getConfigOption(args) {
    let name;
    if (args.profile) {
        name = args.profile;
    }
    let profile = getProfile(name);
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
    profile.access_key_id = await cred.getAccessKeyId();
    profile.access_key_secret = await cred.getAccessKeySecret();
    profile.sts_token = await cred.getSecurityToken();
    return profile;
}