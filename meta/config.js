'use strict';

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
    }
};

const readline = require('readline-sync');
const config = require('../config.js');

exports.run = function () {
    let profile = {};
    profile['access_key_id'] = readline.question(`Access Key ID [${mixed(config.profile.access_key_id)}]: `);
    profile['access_key_secret'] = readline.question(`Access Key Secret [${mixed(config.profile.access_key_secret)}]: `);
    profile['region'] = readline.question('Default Region ID: ') || 'cn-hangzhou';
    profile['language'] = readline.question('Default language: ') || 'zh';
    config.updateProfile(config.profileName, profile);
};

function mixed(value){
    if (!value){
        return 'None';
    }
    value=('*').repeat(6)+value.substring(3);
    return value;
}