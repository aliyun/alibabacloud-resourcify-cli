'use strict';

const config = require('../../config.js');

exports.cmdObj = {
    use: 'arc config delete',
    desc: {
        'zh': '删除配置'
    },
    args: [
        {
            name: 'profile',
            required: true
        }
    ]
};
exports.run = function (args) {
    config.delete(args._[0]);
};