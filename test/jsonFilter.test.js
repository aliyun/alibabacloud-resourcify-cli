'use strict';

const assert = require('assert');

const json = require('../lib/json_filter.js');

describe('json_filter.js', function () {
  it('normal', function () {
    let result;
    let value = { a: '1', b: '2', c: 3 };
    result = json.search(value, 'a');
    assert.strictEqual(result, '1');
    result = json.search(value, 'c');
    assert.strictEqual(result, 3);
  });

  it('map', function () {
    let result;
    let value = {
      a: {
        key: '1',
        value: '2'
      },
      b: 1
    };
    result = json.search(value, 'a');
    assert.deepStrictEqual(result, {key: '1',value: '2'});
    result = json.search(value, 'a.key');
    assert.strictEqual(result, '1');
  });

  it('array',function(){
    let result;
    let value = {
      a: {
        key: ['1','3','4'],
        value: '2'
      },
    };
    result = json.search(value, 'a.key[2]');
    assert.strictEqual(result, '4');
  });

  it('arrayMap',function(){
    let result;
    let value = {
      a: {
        key: [{
          key:'1',
          value:'2'
        },{
          key:'3',
          value:'4'
        }],
        value: '2'
      },
    };
    result = json.search(value, 'a.key[1].value');
    assert.strictEqual(result, '4');
    result = json.search(value, 'a.key[1]');
    assert.deepStrictEqual(result, {
      key:'3',
      value:'4'
    });
  });

  it('array *', function () {
    let result;
    let value = {
      a: {
        key: [{
          key: '1',
          value: '2'
        }, {
          key: '3',
          value: '4'
        }],
        value: '2'
      },
    };
    result = json.search(value, 'a.key[*]');
    assert.deepStrictEqual(result, [{
      key: '1',
      value: '2'
    }, {
      key: '3',
      value: '4'
    }]);

    result = json.search(value, 'a.key[*].value');
    assert.deepStrictEqual(result, ['2', '4']);
  });
});
