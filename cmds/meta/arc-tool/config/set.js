'use strict';

const config = require('../../config.js');

exports.cmdObj = {
    use: 'arc config set',
    desc: {
        zh: '设置配置中的字段，当字段不存在时添加；当value为空时，代表删除指定字段；若只是指定profile，则表示更改默认配置'
    },
    usage: [
        'arc config set [<key> <value>] [--profile profileName]'
    ],
    args: [
        {
            name: 'key',
        },
        {
            name: 'value',
        }
    ]
};

exports.validate = function (args) {
    if (args._[0] && args._[1] === undefined) {
        return 'value master be set';
    }
};

exports.run = function (args) {
    if (!args._[1]) {
        delete config.profile[args._[0]];
    } else {
        config.profile[args._[0]] = args._[1];
    }
    config.updateProfile(config.profileName, config.profile);
};