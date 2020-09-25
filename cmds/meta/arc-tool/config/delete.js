'use strict';

const config = require('../../../../config.js');

exports.cmdObj = {
    use: 'arc config delete',
    usage:[
        'arc config delete <--profile profileName>'
    ],
    desc: {
        'zh': '删除配置'
    },
    args:[
        {
            name:'profileName',
            required:true
        }
    ]
};

exports.run = function (argv) {
    config.delete(argv._[0]);
};