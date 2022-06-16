'use strict';

/**
 * 配置相关逻辑
 */

const fs = require('fs');
const path = require('path');

// 默认配置路径
const DEFAULT_CONFIG_FILE_PATH = path.join(require('os').homedir(), '.aliyun', 'arc.json');

// 初始化 profile
const initProfile = {
  access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
  access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRET,
  sts_token: process.env.ALIBABACLOUD_SECURITY_TOKEN || process.env.ALICLOUD_STS_TOKEN,
  region: process.env.ALICLOUD_REGION_ID || 'cn-hangzhou',
  language: 'zh'
};

class Config {
  constructor(configPath) {
    // env ARC_CONFIG_PATH used for test
    this.configPath = configPath || process.env.ARC_CONFIG_PATH || DEFAULT_CONFIG_FILE_PATH;
  }

  getConfig() {
    if (!fs.existsSync(this.configPath)) {
      return null;
    }

    const buf = fs.readFileSync(this.configPath, 'utf8');
    const config = JSON.parse(buf);
    return config;
  }

  getProfile(name) {
    const config = this.getConfig();

    // if no config, return back init profile
    if (!config) {
      return { name: 'default', profile: initProfile };
    }

    // if no profile name, return back default profile
    if (!name) {
      return { name: config.default, profile: config.profiles[config.default] };
    }

    // if specific name is inexist, return back init profile
    if (!config.profiles[name]) {
      return { name, profile: initProfile };
    }

    // found the target profile
    return { name, profile: config.profiles[name] };
  }

  // 更新profile
  updateProfile(name, profile) {
    let config = this.getConfig();

    if (!config) {
      config = { profiles: {} };
    }

    config.profiles[name] = profile;
    config.default = name;

    const configPathDir = path.dirname(this.configPath);
    if (!fs.existsSync(configPathDir)) {
      fs.mkdirSync(configPathDir);
    }

    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }

  // 删除profile
  delete(name) {
    const config = this.getConfig();
    if (!config) {
      return;
    }

    if (name === config.default) {
      console.error('cannot delete default profile');
      process.exit(-1);
    }

    delete config.profiles[name];
    fs.writeFileSync(this.configPath, JSON.stringify(config, null, 2));
  }
}

module.exports = Config;
