/**
 * 配置相关逻辑
 */
'use strict';

const fs = require('fs');
const { configFilePath, configPathDir, initProfileName } = require('./arc_config.js');
let configPath = configFilePath;

// 初始化profile
const initProfile = {
  access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
  access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRET,
  sts_token: process.env.ALICLOUD_STS_TOKEN,
  region: 'cn-hangzhou',
  language: 'zh'
};

// 设置配置文件路径
exports.setConfigPath = function (confPath) {
  if (configPath) {
    configPath = confPath;
  }
};

// 获取配置集合
exports.getConfig = function () {
  if (!fs.existsSync(configPath)) {
    return null;
  }
  let buf = fs.readFileSync(configPath);
  let config = JSON.parse(buf);
  return config;
};

// 获取指定profile，若无指定，则获取默认profile
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

// 更新profile
exports.updateProfile = function (name, profile) {
  let config = exports.getConfig();
  if (!config) {
    config = { profiles: {} };
  }
  config.profiles[name] = profile;
  config.default = name;
  if (configPath === configFilePath) {
    if (!fs.existsSync(configPathDir)) {
      fs.mkdirSync(configPathDir);
    }
  }
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};

// 删除profile
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