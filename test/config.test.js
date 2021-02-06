'use strict';

const fs = require('fs');
const path = require('path');

const assert = require('assert');
const config = require('../lib/config.js');

describe('config.js', function () {
  let confPath = path.join(__dirname, 'arc.json');
  config.setConfigPath(confPath);

  beforeEach(function () {
    if (fs.existsSync(confPath)) {
      fs.unlinkSync(confPath);
    }
  });

  after(function () {
    if (fs.existsSync(confPath)) {
      fs.unlinkSync(confPath);
    }
  });

  it('function getConfig()', function () {
    let conf = config.getConfig();
    assert.strictEqual(conf, null, 'conf should be null when configFilePath does not exist');
  });

  it('function getProfile()', function () {
    let { profile } = config.getProfile();

    let initProfile = {
      access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
      access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRET,
      sts_token: undefined,
      region: 'cn-hangzhou',
      language: 'zh'
    };

    assert.deepStrictEqual(profile, initProfile, 'profile return initProifle when configFilePath doesnot exit');
    let conf = {
      'profiles': {
        'test': {
          'access_key_id': 'access_key_id',
          'access_key_secret': 'access_key_secret',
          'region': 'cn-hangzhou',
          'language': 'zh'
        },
        'test2': {
          'access_key_id': 'test_id',
          'access_key_secret': 'test_secret',
          'region': 'cn-hangzhou',
          'language': 'en'
        }
      },
      'default': 'test'
    };
    fs.writeFileSync(confPath, JSON.stringify(conf));
    let profileInfo = config.getProfile();
    assert.deepStrictEqual(profileInfo.profile, conf.profiles.test, 'Get the default profile when the profile name is not specified');
    profileInfo = config.getProfile('test2');
    assert.deepStrictEqual(profileInfo.profile, conf.profiles.test2, 'Get the specified profile');
  });
  it('function updateProfile()', function () {
    let name = 'test';
    let profile = {
      'access_key_id': 'access_key_id',
      'access_key_secret': 'access_key_secret',
      'region': 'cn-hangzhou',
      'language': 'zh'
    };
    let expConf = {
      profiles: {
        test: profile
      },
      default: name
    };
    config.updateProfile(name, profile);
    let conf = config.getConfig();
    assert.deepStrictEqual(conf, expConf, 'Configuration should be successful');
  });
  it('function delete()', function () {
    let initConf = {
      'profiles': {
        'test': {
          'access_key_id': 'access_key_id',
          'access_key_secret': 'access_key_secret',
          'region': 'cn-hangzhou',
          'language': 'zh'
        },
        'test2': {
          'access_key_id': 'test_id',
          'access_key_secret': 'test_secret',
          'region': 'cn-hangzhou',
          'language': 'en'
        }
      },
      'default': 'test'
    };
    fs.writeFileSync(confPath, JSON.stringify(initConf));
    // Try to delete the default profile
    // interrupt process.exit()
    // config.delete('test')
    config.delete('test2');
    let actualConf = config.getConfig();
    let expConf = {
      'profiles': {
        'test': {
          'access_key_id': 'access_key_id',
          'access_key_secret': 'access_key_secret',
          'region': 'cn-hangzhou',
          'language': 'zh'
        }
      },
      'default': 'test'
    };
    assert.deepStrictEqual(actualConf, expConf, 'The delete operation should be successful');
  });

  it('getProfile(): unexist profile name', function () {
    let initConf = {
      'profiles': {
        'test': {
          'access_key_id': 'access_key_id',
          'access_key_secret': 'access_key_secret',
          'region': 'cn-hangzhou',
          'language': 'zh'
        },
        'test2': {
          'access_key_id': 'test_id',
          'access_key_secret': 'test_secret',
          'region': 'cn-hangzhou',
          'language': 'en'
        }
      },
      'default': 'test'
    };
    fs.writeFileSync(confPath, JSON.stringify(initConf));
    let { name, profile } = config.getProfile('test3');
    let initProfile = {
      access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
      access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
      region: 'cn-hangzhou',
      language: 'zh',
      sts_token: undefined
    };
    assert.deepStrictEqual(profile, initProfile);
    assert.strictEqual(name, 'test3');
  });
});