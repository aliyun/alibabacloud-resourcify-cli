'use strict';

const path = require('path');
const assert = require('assert');

const { loadContext } = require('../lib/context.js');

describe('context.js', function () {

  before(() => {
    process.env.ARC_CONFIG_PATH = path.join(__dirname, 'fixtures/arc.json');
  });

  after(() => {
    process.env.ARC_CONFIG_PATH = undefined;
  });

  it('load context should ok', function () {
    const ctx = loadContext([]);
    assert.deepStrictEqual(ctx, {
      'argv': [],
      'mappingValue': {},
      'parsed': new Map(),
      'profile': {
        'access_key_id': 'id',
        'access_key_secret': 'secret',
        'language': 'zh',
        'region': 'cn-hangzhou'
      },
      'profileName': 'default'
    });
  });

  it('load context with --profile should ok', function () {
    const ctx = loadContext(['--profile', 'default']);
    assert.deepStrictEqual(ctx, {
      'argv': [],
      'mappingValue': {},
      'parsed': new Map([['profile', 'default']]),
      'profile': {
        'access_key_id': 'id',
        'access_key_secret': 'secret',
        'language': 'zh',
        'region': 'cn-hangzhou'
      },
      'profileName': 'default'
    });
  });
});