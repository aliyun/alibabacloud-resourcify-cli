'use strict';

const assert = require('assert');
const { display } = require('../lib/display');

describe('display.js', function () {
  const fixtures = '{"files": ["A", "B", "C"]}';
  it('display should ok', function () {
    assert.strictEqual(display(fixtures), '{\n  "files": [\n    "A",\n    "B",\n    "C"\n  ]\n}');
  });

  it('query should ok', function () {
    assert.strictEqual(display(fixtures, '"files"'), '[\n  "A",\n  "B",\n  "C"\n]');
  });

  it('format(json) should ok', function () {
    assert.strictEqual(display(fixtures, undefined, 'json'), '{\n  "files": [\n    "A",\n    "B",\n    "C"\n  ]\n}');
  });

  it('format(yaml) should ok', function () {
    assert.strictEqual(display(fixtures, undefined, 'yaml'), '---\n  files: \n    - "A"\n    - "B"\n    - "C"\n');
  });

  it('empty input should not ok', function () {
    assert.throws(() => {
      display('null');
    }, (err) => {
      assert.strictEqual(err.message, 'result is empty');
      return true;
    });
  });

  describe('format(csv)', function () {
    it('non-array should not ok', function () {
      assert.throws(() => {
        display('{}', undefined, 'csv');
      }, (err) => {
        assert.strictEqual(err.message, 'can not display a non-array result');
        return true;
      });
    });

    it('empty array should not ok', function () {
      assert.throws(() => {
        display('[]', undefined, 'csv');
      }, (err) => {
        assert.strictEqual(err.message, 'can not display a empty array result');
        return true;
      });
    });

    it('array item is not object should not ok', function () {
      assert.throws(() => {
        display('["str"]', undefined, 'csv');
      }, (err) => {
        assert.strictEqual(err.message, 'result item is not object');
        return true;
      });
    });

    it('csv should ok', function () {
      assert.strictEqual(display('[{"key": "value"}]', undefined, 'csv'), '"key"\n"value"');
    });
  });

  describe('format(table)', function () {
    it('non-array should not ok', function () {
      assert.throws(() => {
        display('{}', undefined, 'table');
      }, (err) => {
        assert.strictEqual(err.message, 'can not display a non-array result');
        return true;
      });
    });

    it('table should ok', function () {
      assert.strictEqual(display('[{"key": "value"}]', undefined, 'table'), 'key  \n-----\nvalue\n\n');
    });
  });

  it('invalid format should not ok', function () {
    assert.throws(() => {
      display('{}', undefined, 'invalid');
    }, (err) => {
      assert.strictEqual(err.message, 'invalid format: "invalid"');
      return true;
    });
  });
});