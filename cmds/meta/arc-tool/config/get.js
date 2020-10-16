'use strict';

const config = require('../../../../config.js');
const output = require('../../../../output.js');

exports.cmdObj = {
  use: 'arc config get',
  usage:[
    'arc config get [--profile profileName]'
  ],
  desc:{
    zh:'获取指定配置信息',
    en:`Get the specified profile information`
  }
};

exports.run = function () {
  let data=JSON.stringify(config.profile,null,2);
  output.log(data);
};