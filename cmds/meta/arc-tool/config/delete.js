'use strict';

const Config = require('../../../../lib/config.js');

exports.cmdObj = {
  usage: [
    'arc config delete <--profile profileName>'
  ],
  desc: {
    zh: '删除配置',
    en: `remove profile`
  },
  args: [
    {
      name: 'profileName',
      required: true
    }
  ]
};

exports.run = function (ctx) {
  const config = new Config();
  config.delete(ctx.argv[0]);
};