'use strict';

const path = require('path');
const fs = require('fs');
const USER_HOME = require('os').homedir();

const configFilePath = path.join(USER_HOME, '.aliyun', 'arc.json');

function getConfig() {
    if (!fs.existsSync(configFilePath)) {
        return null;
    }
    let buf = fs.readFileSync(configFilePath);
    let config = JSON.parse(buf);
    return config;
}

function getProfile(name) {
    let config = getConfig();
    if (!config) {
        return { name: 'default', profile: null };
    }
    if (!name) {
        return { name: config.default, profile: config.credential[config.default] };
    }
    return { name, profile: config.credential[name] };
}

function updateProfile(name, profile) {
    let config = getConfig();
    if (!config) {
        config = { credential: {} };
    }
    config.credential[name] = profile;
    config.default = name;
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
}

exports.language = 'en';
module.exports = {
    getConfig,
    getProfile,
    updateProfile
};