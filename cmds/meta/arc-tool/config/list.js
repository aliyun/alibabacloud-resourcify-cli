'use strict';
const Config = require('../../../../lib/config.js');
let output = require('../../../../lib/output.js');

exports.cmdObj = {
  usage: ['arc-tool config list [--profile profileName]'],
  desc: {
    zh: '列举指定配置所有信息，未指定则返回默认',
    en: `List all the information of the specified configuration, return to the default if not specified`
  }
};

exports.run = function () {
  const config = new Config();
  const conf = config.getConfig();
  if (!conf) {
    output.error('No configuration currently exists');
    return;
  }

  output.log(JSON.stringify(conf, null, 2));
};
