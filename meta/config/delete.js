'use strict';

const config = require('../../config.js');

exports.cmdObj = {
    use: 'arc config delete',
    usage:[
        'arc config delete <--profile profileName>'
    ],
    desc: {
        'zh': '删除配置'
    }
};

exports.run = function () {
    config.delete(config.profileName);
};