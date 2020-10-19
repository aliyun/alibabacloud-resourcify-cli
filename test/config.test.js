'use strict';

const assert = require('assert');
const config = require('../lib/config.js');
const fs = require('fs');
const path = require('path');
describe('config.js', function () {
  config.configFilePath = path.join(__dirname, 'arc.json');
  beforeEach(function () {
    if (fs.existsSync(config.configFilePath)) {
      fs.unlinkSync(config.configFilePath);
    }
  });
  after(function () {
    if (fs.existsSync(config.configFilePath)) {
      fs.unlinkSync(config.configFilePath);
    }
  });
  it('function getConfig()', function () {
    let conf = config.getConfig();
    assert.strictEqual(conf, null, 'conf should be null when configFilePath does not exist');
  });
  it('function getProfile()', function () {
    config.getProfile();
    let initProfile = {
      access_key_id: process.env.ALIBABACLOUD_ACCESS_KEY_ID || process.env.ALICLOUD_ACCESS_KEY_ID,
      access_key_secret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET || process.env.ALICLOUD_ACCESS_KEY_SECRE,
      region: 'cn-hangzhou',
      language: 'zh'
    };
    assert.deepStrictEqual(config.profile, initProfile, 'profile return initProifle when configFilePath doesnot exit');
    let conf = {
      'credential': {
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
    fs.writeFileSync(config.configFilePath, JSON.stringify(conf));
    config.getProfile();
    assert.deepStrictEqual(config.profile, conf.credential.test, 'Get the default profile when the profile name is not specified');
    config.getProfile('test2');
    assert.deepStrictEqual(config.profile, conf.credential.test2, 'Get the specified profile');
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
      credential: {
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
      'credential': {
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
    fs.writeFileSync(config.configFilePath, JSON.stringify(initConf));
    // Try to delete the default profile
    // interrupt process.exit()
    // config.delete('test')
    config.delete('test2');
    let actualConf = config.getConfig();
    let expConf = {
      'credential': {
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
});