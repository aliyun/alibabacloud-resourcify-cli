'use strict';

exports.cmdObj = {
    use: 'arc config',
    desc: {
        zh: '交互式配置CLI，根据提示输入参数值，完成后自动将现有配置作为默认配置'
    },
    flags: {
        profile: {
            alias: 'p',
            desc: {
                zh: '指定配置的名称'
            }
        },
        mode: {
            alias: 'm',
            desc: {
                zh: '指定凭证类型'
            },
            choices: [
                'AK',
                'StsToken',
                'EcsRamRole'
            ]
        }
    },
    sub: {
        delete: {
            zh: '删除配置'
        },
        get: {
            zh: '获取配置详细信息'
        },
        list: {
            zh: '获取所有配置信息'
        },
        set: {
            zh: '设置配置字段值'
        }
    }
};

const readline = require('readline-sync');
const { updateProfile } = require('../config.js');

exports.run = function (args) {
    let profile = {};
    let name;
    if (!args.profile) {
        name = readline.question('profile name: ');
    } else {
        name = args.profile;
    }
    if (!args.mode) {
        profile['mode'] = readline.question('mode: ');
    } else {
        profile['mode'] = args.mode;
    }
    switch (profile['mode']) {
        case 'AK':
            profile['access_key_id'] = readline.question('Access Key ID: ');
            profile['access_key_secret'] = readline.question('Access Key Secret: ');
            break;
        case 'StsToken':
            profile['access_key_id'] = readline.question('Access Key ID: ');
            profile['access_key_secret'] = readline.question('Access Key Secret: ');
            profile['sts_token'] = readline.question('Sts Token: ');
            break;
    }
    profile['region'] = readline.question('Default Region ID: ') || 'cn-hangzhou';
    profile['language'] = readline.question('Default language: ') || 'zh';
    updateProfile(name, profile);
};