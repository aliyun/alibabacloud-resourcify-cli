'use strict';

const path = require('path');
const fs = require('fs');
const USER_HOME = require('os').homedir();

const configFilePath = path.join(USER_HOME, '.aliyun', 'arc.json');

exports.profileName = 'default';
exports.profile = {
    mode: 'AK',
    access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
    access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
    region: 'cn-hangzhou',
    language: 'zh'
};

exports.getConfig = function () {
    if (!fs.existsSync(configFilePath)) {
        return null;
    }
    let buf = fs.readFileSync(configFilePath);
    let config = JSON.parse(buf);
    return config;
};

exports.getProfile = function (name) {
    let config = exports.getConfig();
    if (!config) {
        return;
    }
    if (!name) {
        exports.profileName = config.credential[config.default];
        exports.profile = config.credential[config.default];
        return;
    }
    exports.profileName = name;
    exports.profile = config.credential[name];
};

exports.updateProfile = function (name, profile) {
    let config = exports.getConfig();
    if (!config) {
        config = { credential: {} };
    }
    config.credential[name] = profile;
    config.default = name;
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

exports.delete = function (name) {
    let config = exports.getConfig();
    if (!config) {
        return;
    }
    delete config.credential[name];
    if (name === config.default) {
        console.error('cannot delete default profile');
        process.exit(-1);
    }
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};