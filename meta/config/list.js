'use strict';
const config = require('../../config.js');
let output = require('../../output.js');

exports.cmdObj = {
    use: 'arc config list',
    desc: {
        zh: '列举所有配置'
    }
};

exports.run = function () {
    let conf = config.getConfig();
    if (!conf) {
        output.error('config is empty, please check the file status or use arc config to configure');
        return;
    }
    let data = JSON.stringify(conf, null, 2);
    output.log(data);
};