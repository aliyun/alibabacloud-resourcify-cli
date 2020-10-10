'use strict';

const assert = require('assert');
const parser = require('../parser.js');
describe('parser.js', function () {
    it('function parseOne()', function () {
        parser.argv = {
            _: [], _cmds: [], _next: true, _err: '',
            _args: ['--flag1', 'value1', '--flag2=value2', '--flag3', 'value3', 'value4', '--falg4',`[{key1:value1,key2:value2},{key1:value3,key2:value4}]`]
        };
        parser.parseOne();
    });

});