'use strict';
const config = require('../config.js');
exports.cmdObj = {
    use: 'arc config',
    desc: {
        zh: '交互式配置CLI，根据提示输入参数值，完成后自动将现有配置作为默认配置'
    },
    sub: {
        delete: {
            zh: '删除配置'
        },
        get: {
            zh: '获取配置指定字段值'
        },
        list: {
            zh: '获取指定配置所有信息'
        },
        set: {
            zh: '设置配置字段值'
        }
    },
    options: {
        'access-key-id': {
            required: true,
            default: function () {
                return config.profile.access_key_id || undefined;
            },
            desc: {
                zh: '凭证ID'
            }
        },
        'access-key-secret': {
            required: true,
            default: function () {
                return config.profile.access_key_secret || undefined;
            },
            desc: {
                zh: '凭证密钥'
            }
        },
        'region': {
            default: function () {
                return config.profile.region || 'cn-hangzhou';
            },
            desc: {
                zh: '阿里云区域'
            }
        },
        'language': {
            default: function () {
                return config.profile.language || 'zh';
            },
            desc: {
                zh: 'CLI语言'
            },
            choices: [
                'zh',
                'en'
            ]
        }
    }
};

exports.run = function (argv) {
    let profile = {};
    profile['access_key_id'] = argv._parsedValue['access-key-id'];
    profile['access_key_secret'] = argv._parsedValue['access-key-secret'];
    profile['region'] = argv._parsedValue['region'] || config.profile.region;
    profile['language'] = argv._parsedValue['language'] || config.profile.language;
    config.updateProfile(config.profileName, profile);
};