'use strict';

const assert = require('assert');

const { parse } = require('../lib/args');

describe('args parse', function () {
  it('parse argv should ok', function () {
    let r = parse([]);
    assert.deepStrictEqual(r.argv, []);
    r = parse(['help']);
    assert.deepStrictEqual(r.argv, ['help']);
  });

  it('parse args should ok', function () {
    let r = parse([]);
    assert.deepStrictEqual(r.parsed, new Map());
    r = parse(['--help']);
    assert.deepStrictEqual(r.parsed, new Map([
      ['help']
    ]));
    r = parse(['--akid=akid']);
    assert.deepStrictEqual(r.parsed, new Map([
      ['akid', 'akid']
    ]));

    r = parse(['--aksecret', 'secret']);
    assert.deepStrictEqual(r.parsed, new Map([
      ['aksecret', 'secret']
    ]));

    r = parse(['--aksecret']);
    assert.deepStrictEqual(r.parsed, new Map([
      ['aksecret', undefined]
    ]));
  });

  it('alias should ok', function () {
    let r = parse(['-i'], {});
    assert.deepStrictEqual(r.parsed, new Map([]));
    r = parse(['-i'], {
      interaction: {
        alias: 'i'
      }
    });
    assert.deepStrictEqual(r.parsed, new Map([
      ['interaction', undefined]
    ]));

    r = parse(['-i=test'], {
      interaction: {
        alias: 'i'
      }
    });
    assert.deepStrictEqual(r.parsed, new Map([
      ['interaction', 'test']
    ]));

    r = parse(['-i', 'test'], {
      interaction: {
        alias: 'i'
      }
    });
    assert.deepStrictEqual(r.parsed, new Map([
      ['interaction', 'test']
    ]));
  });
});