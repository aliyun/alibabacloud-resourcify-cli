'use strict';

const config = require('../../../../lib/config.js');

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
  config.delete(ctx.argv[0]);
};