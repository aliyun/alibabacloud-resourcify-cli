'use strict';

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
  const data = JSON.stringify(ctx.profile, null, 2);
  console.log(data);
};