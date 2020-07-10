#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const { help } = require('../helper.js');
const parse = require('yargs-parser');
const util = require('../util');

let {cmds, descFilePath, argv } = util.getBasicInfo(process.argv.slice(2));
const cmd = require(descFilePath);

if (cmds[cmds.length-1]==='help') {
    help(cmd.cmdObj,argv);
    process.exit(0);
}

let opts = util.fillYargsFlag(cmd.cmdObj);

argv = parse(argv, opts);
let errorMsg='';
errorMsg=util.validate(cmd.cmdObj, argv);

if (!errorMsg&&cmd.validate) {
    errorMsg=cmd.validate(argv);
} 

if (errorMsg){
    help(cmd.cmdObj,argv);
    console.error(errorMsg);
    process.exit(-1);
}

if (!cmd.run){
    help(cmd.cmdObj,argv);
    process.exit(0);
}

// if (cmds&&cmds[0]!=='config'){
//     console.log('dsfs');
// }

run();
// 获取终端输入

async function run(){
    cmd.run(argv);
}