'use strict';

const assert = require('assert');
const util = require('../util');
describe('util.js', function () {
    it('getBasicInfo: should return `cs cluster` `meta/cs/cluster.js` `[help]', function () {
        let { cmds, descFilePath, argv } = util.getBasicInfo(['cs', 'cluster', 'help']);
        assert.deepEqual(cmds, ['cs', 'cluster']);
        assert.ok(descFilePath.includes('meta/cs/cluster.js'));
        assert.deepEqual(argv, ['help']);
    });
    it('fillflags()-fillGroup(): opts should not change', function () {
        let opts = {
            number: [],
            boolean: [],
            string: [],
            array: [],
            configuration: {
                'unknown-options-as-args': true
            }
        };

        let actualOpts = util.fillflags(opts, null);
        assert.deepEqual(actualOpts, opts);
        let actualGroupOpts=util.fillGroup(opts,null);
        assert.deepEqual(actualGroupOpts, opts);

    });
    it('fillflags(): opts should return correctly',function(){
        let opts = {
            number: [],
            boolean: [],
            string: [],
            array: [],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        let flags={
            'number-flag':{
                vtype:'number'
            },
            'array-flag':{
                vtype:'array'
            },
            'boolean-flag':{
                vtype:'boolean'
            },
            'number-array-flag':{
                vtype:'numberArray'
            },
            'string-flag':{
                vtype:'string'
            },
            'default-type-flag':{}
        };

        let actualOpts = util.fillflags(opts, flags);
        let expOpts={
            number: ['number-flag'],
            boolean: ['boolean-flag'],
            string: ['string-flag','default-type-flag'],
            array: ['array-flag',{key:'number-array-flag',number:true}],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        assert.deepEqual(actualOpts, expOpts);
       
    });
    it('fillflags(): opts should return correctly',function(){
        let opts = {
            number: [],
            boolean: [],
            string: [],
            array: [],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        
        let group={
            first:{
                'number-flag':{
                    vtype:'number'
                },
            }
        };
        let expOpts={number:['number-flag'],configuration: {'unknown-options-as-args': true},array:[],boolean:[],string:[]};
        let actualOpts = util.fillGroup(opts, group);
        assert.deepEqual(actualOpts, expOpts);
    });

    it('fillYargsFlag(): opts should not change',function(){
        let opts = {
            number: [],
            boolean: [],
            string: [],
            array: [],
            configuration: {
                'unknown-options-as-args': true
            }
        };
        let actual=util.fillYargsFlag(opts,null);
        assert.deepEqual(actual,opts);
    });

    // it('validate(): no error',function(){
    //     let cmdObj={
    //         flags:{
    //             test:{
    //                 desc:{
    //                     zh:'for test'
    //                 }
    //             }
    //         },
    //         args:[
    //             {
    //                 name:'args1'
    //             }
    //         ]
    //     };
    // });
});