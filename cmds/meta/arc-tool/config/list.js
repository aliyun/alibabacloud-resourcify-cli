'use strict';
const config = require('../../../../config.js');
let output = require('../../../../output.js');

exports.cmdObj = {
    use: 'arc config list',
    usage: ['arc config list [--profile profileName]'],
    desc: {
        zh: '列举指定配置所有信息，未指定则返回默认',
        en: `List all the information of the specified configuration, return to the default if not specified`
    }
};

exports.run = function () {
    let conf = config.getConfig();
    if (!conf) {
        output.error('No configuration currently exists');
    } else {
        let data = JSON.stringify(conf, null, 2);
        output.log(data);
    }
};