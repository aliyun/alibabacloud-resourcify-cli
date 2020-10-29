'use strict';

const output = require('../../../../lib/output.js');

exports.cmdObj = {
  usage: [
    'arc config get [--profile profileName]'
  ],
  desc: {
    zh: '获取指定配置信息',
    en: `Get the specified profile information`
  }
};

exports.run = function (ctx) {
  let data = JSON.stringify(ctx.profile, null, 2);
  output.log(data);
};