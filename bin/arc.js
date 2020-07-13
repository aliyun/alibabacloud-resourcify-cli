#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const { help } = require('../helper.js');
const parse = require('yargs-parser');
const util = require('../util');
let config = require('../config.js');
let output = require('../output.js');

config.getProfile();
let { cmds, descFilePath, argv } = util.getBasicInfo(process.argv.slice(2));
const cmd = require(descFilePath);

// help
if (cmds[cmds.length - 1] === 'help') {
    help(cmd.cmdObj, config.profile.language);
    process.exit(0);
}

// 填充flag
let opts = util.fillYargsFlag(cmd.cmdObj);

// 解析flag
argv = parse(argv, opts);
let errorMsg = '';

// 验证flag
errorMsg = util.validate(cmd.cmdObj, argv);

if (!errorMsg && cmd.validate) {
    errorMsg = cmd.validate(argv);
}

if (errorMsg) {
    help(cmd.cmdObj, config.profile.language);
    console.error(errorMsg);
    process.exit(-1);
}

if (!cmd.run) {
    help(cmd.cmdObj, config.profile.language);
    process.exit(0);
}

// 运行
run();

async function run() {
    await cmd.run(argv);
    if (output.errorMsg) {
        console.error(output.errorMsg);
    } else {
        console.log(output.result);
    }
}