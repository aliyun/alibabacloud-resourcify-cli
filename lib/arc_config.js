'use strict';

const path = require('path');
const USER_HOME = require('os').homedir();

exports.configPathDir = path.join(USER_HOME, '.aliyun');
exports.configFileName = 'arc.json';
exports.configFilePath = path.join(exports.configPathDir, exports.configFileName);
exports.metaFilePath = path.join(__dirname, '..');
exports.initProfileName = 'default';
