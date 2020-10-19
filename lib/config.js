'use strict';

const path = require('path');
const fs = require('fs');
const USER_HOME = require('os').homedir();

exports.configFilePath = path.join(USER_HOME, '.aliyun', 'arc.json');

const initProfileName = 'default';
exports.profileName = initProfileName;
const initProfile = {
  access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
  access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
  region: 'cn-hangzhou',
  language: 'zh'
};

exports.profile = initProfile;

exports.getConfig = function () {
  if (!fs.existsSync(exports.configFilePath)) {
    return null;
  }
  let buf = fs.readFileSync(exports.configFilePath);
  let config = JSON.parse(buf);
  return config;
};

exports.getProfile = function (name) {
  let config = exports.getConfig();
  if (!config) {
    return;
  }
  if (!name) {
    exports.profileName = config.default;
    exports.profile = config.credential[config.default];
    return;
  }
  exports.profileName = name;
  if (!config.credential[name]) {
    exports.profile = initProfile;
  } else {
    exports.profile = config.credential[name];
  }

};

exports.updateProfile = function (name, profile) {
  let config = exports.getConfig();
  if (!config) {
    config = { credential: {} };
  }
  config.credential[name] = profile;
  config.default = name;
  fs.writeFileSync(exports.configFilePath, JSON.stringify(config, null, 2));
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
  delete config.credential[name];
  fs.writeFileSync(exports.configFilePath, JSON.stringify(config, null, 2));
};