'use strict';

const path=require('path');
const USER_HOME = require('os').homedir();

exports.configFilePath = path.join(USER_HOME, '.aliyun', 'arc.json');
exports.metaFilePath = path.join(__dirname, '..');
exports.initProfileName = 'default';
