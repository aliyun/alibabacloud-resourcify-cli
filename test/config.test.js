'use strict';

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const Config = require('../lib/config.js');

describe('config.js', function () {
  const confPath = path.join(__dirname, 'arc.json');
  const config = new Config(confPath);

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
    const conf = config.getConfig();
    assert.strictEqual(conf, null, 'conf should be null when configFilePath does not exist');
  });

  it('function getProfile()', function () {
    const { profile } = config.getProfile();

    const initProfile = {
      access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
      access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRET,
      sts_token: undefined,
      region: 'cn-hangzhou',
      language: 'zh'
    };

    assert.deepStrictEqual(profile, initProfile, 'profile return initProifle when configFilePath doesnot exit');
    const conf = {
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
    const name = 'test';
    const profile = {
      'access_key_id': 'access_key_id',
      'access_key_secret': 'access_key_secret',
      'region': 'cn-hangzhou',
      'language': 'zh'
    };

    const expConf = {
      profiles: {
        test: profile
      },
      default: name
    };
    config.updateProfile(name, profile);
    const conf = config.getConfig();
    assert.deepStrictEqual(conf, expConf, 'Configuration should be successful');
  });

  it('function delete()', function () {
    const initConf = {
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
    const actualConf = config.getConfig();
    const expConf = {
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
    const initConf = {
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
    const { name, profile } = config.getProfile('test3');
    const initProfile = {
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
