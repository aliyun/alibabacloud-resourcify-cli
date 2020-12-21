/**
 * 默认配置
 */
'use strict';

const path = require('path');
const USER_HOME = require('os').homedir();

// 默认配置目录
exports.configPathDir = path.join(USER_HOME, '.aliyun');
// 默认配置文件名
exports.configFileName = 'arc.json';
// 默认配置路径
exports.configFilePath = path.join(exports.configPathDir, exports.configFileName);
// 命令文件根目录
exports.metaFilePath = path.join(__dirname, '..');
// 默认配置名
exports.initProfileName = 'default';
