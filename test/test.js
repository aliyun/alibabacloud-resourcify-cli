'use strict';

const assert = require('assert');
const util = require('../util');
describe('util.js', function () {
    it('getBasicInfo: should return `cs cluster` `meta/cs/cluster.js` `[]', function () {
        let { cmds, descFilePath, argv } = util.getBasicInfo(['cs', 'cluster']);
        assert.deepEqual(cmds, ['cs', 'cluster']);
        assert.ok(descFilePath.includes('meta/cs/cluster.js'));
        assert.deepEqual(argv, []);
    });

    it(`getBasicInfo(): should return ['cs', 'cluster', 'help']`, function () {
        let { cmds } = util.getBasicInfo(['cs', 'cluster', 'help']);
        assert.deepEqual(cmds, ['cs', 'cluster', 'help']);
    });

    it('fillflags(): opts should return correctly', function () {
        let opts = {
            number: [],
            boolean: [],
            string: [],
            array: [],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        let flags = {
            'number-flag': {
                vtype: 'number'
            },
            'array-flag': {
                vtype: 'array'
            },
            'boolean-flag': {
                vtype: 'boolean'
            },
            'number-array-flag': {
                vtype: 'numberArray'
            },
            'string-flag': {
                vtype: 'string'
            },
            'default-type-flag': {}
        };

        let actualOpts = util.fillflags(opts, flags);
        let expOpts = {
            number: ['number-flag'],
            boolean: ['boolean-flag'],
            string: ['string-flag', 'default-type-flag'],
            array: ['array-flag', { key: 'number-array-flag', number: true }],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        assert.deepEqual(actualOpts, expOpts);

    });

    it('fillYargsFlag(): opts should not change', function () {
        let opts = {
            alias: {},
            number: [],
            boolean: [],
            string: [],
            array: [],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        let actual = util.fillYargsFlag(opts, null);
        assert.deepEqual(actual, opts);
    });

    it('validate()', function () {
        let cmdObj = {
            args: [
                {
                    name: 'pargs1',
                    required: true
                },
                {
                    name: 'pargs2',
                }
            ]
        };
        let argv = {
            _: []
        };
        let error = util.validate(cmdObj, argv);
        assert.equal(error, 'Missing required position parameter');
    });

});