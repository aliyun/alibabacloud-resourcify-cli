'use strict';

const fs = require('fs');
const { configFilePath, initProfileName } = require('./arc_config.js');
let configPath=configFilePath;
const initProfile = {
  access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
  access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
  region: 'cn-hangzhou',
  language: 'zh'
};

exports.setConfigPath=function(confPath){
  if (configPath){
    configPath=confPath;
  }
};

exports.getConfig = function () {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  let buf = fs.readFileSync(configPath);
  let config = JSON.parse(buf);
  return config;
};

exports.getProfile = function (name) {
  let config = exports.getConfig();
  if (!config) {
    return { name: initProfileName, profile: initProfile };
  }
  if (!name) {
    return { name: config.default, profile: config.profiles[config.default] };
  }
  if (!config.profiles[name]) {
    return { name, profile: initProfile };
  }
  return { name, profile: config.profiles[name] };
};

exports.updateProfile = function (name, profile) {
  let config = exports.getConfig();
  if (!config) {
    config = { profiles: {} };
  }
  config.profiles[name] = profile;
  config.default = name;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

exports.delete = function (name) {
  let config = exports.getConfig();
  if (!config) {
    return;
  }
  if (name === config.default) {
    console.error('cannot delete default profile');
    process.exit(-1);
  }
  delete config.profiles[name];
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};