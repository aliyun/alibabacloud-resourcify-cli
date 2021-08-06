'use strict';

const assert = require('assert');

const Action = require('../lib/action');

describe('action', () => {
  it('new MyAction should ok', async function() {
    class MyAction extends Action {
      constructor(name) {
        super(name, {
          args: [
            {name: 'arg1', required: true},
            {name: 'arg2' }
          ],
          options: {
            option1: {
              required: true,
              choices: ['a', 'b'],
            }
          }
        });
      }

      async run(ctx) {
        assert.deepStrictEqual(ctx.argv, ['argv1']);
        assert.deepStrictEqual(ctx.parsed, new Map([
          ['optionName', 'optionValue']
        ]));
      }
    }
    const action = new MyAction('myaction');
    assert.strictEqual(action.name, 'myaction');
    assert.deepStrictEqual(action.getCommandPath(), ['myaction']);
    await action.handle(['argv1', '--optionName', 'optionValue']);
    const messages = [];
    const originalLog = console.log;
    console.log = function (message) {
      messages.push(message);
    };
    await action.handle(['help']);
    console.log = originalLog;
    assert.deepStrictEqual(messages.map(item => item + '\n').join(''),`用法:
    myaction <arg1> [arg2] [选项]

选项:
  --option1                             *[string]
                                        [可选值: a , b]
`);
  });
});
