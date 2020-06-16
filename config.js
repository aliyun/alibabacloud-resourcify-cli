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
        return null;
    }
    {
        if (!name) {
            return config.credential[config.default];
        }
    }
    return config.credential[name];
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

module.exports = {
    getConfig,
    getProfile,
    updateProfile
};