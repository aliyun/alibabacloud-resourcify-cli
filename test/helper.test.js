'use strict';

const assert = require('assert');

const { lineWrap } = require('../lib/helper');

describe('helper', function () {
  it('lineWrap', () => {
    assert.strictEqual(lineWrap('message less 80'), 'message less 80');
    assert.strictEqual(lineWrap('message less 80'.repeat(10)), `message less 80message less 80message less 80message less 80message less
80message less 80message less 80message less 80message less 80message less 80`);
  });
});
