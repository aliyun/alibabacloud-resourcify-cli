#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';
const { help } = require('../helper.js');
const parse = require('yargs-parser');
const util = require('../util');
let config = require('../config.js');
let output = require('../output.js');
let completion = require('../completion.js');
let rootCmd = require('../meta.js');
let { runInteractively } = require('../interactive.js');



// 运行
run();

async function run() {
    config.getProfile();

    if (process.env.COMP_LINE) {
        let args = process.env.COMP_LINE.split(' ').slice(1);
        let { descFilePath } = util.getBasicInfo(args);
        const cmd = require(descFilePath);
        completion.completion(cmd.cmdObj);
        return;
    }

    let { cmds, descFilePath, argv: args } = util.getBasicInfo(process.argv.slice(2));
    const cmd = require(descFilePath);

    // help
    if (cmds[cmds.length - 1] === 'help') {
        help(cmd.cmdObj, config.profile.language);
        return;
    }

    // 填充flag
    let opts = util.fillYargsFlag(rootCmd.cmdObj);

    // 解析flag
    let argv = parse(args, opts);

    // // 处理全局选项
    if (argv.profile) {
        config.getProfile(argv.profile);
    }

    if (argv.region) {
        config.profile.region = argv.region;
    }

    if (argv['interaction']) {
        let result = await runInteractively(cmd.cmdObj, argv);
        let command = ['arc'];
        args = result.args;
        command.push.apply(command, cmds);
        command.push.apply(command, args);
        console.log(command.join(' '));
        if (!result.isRun) {
            return;
        }
    }

    // // 解析命令option
    opts = util.fillYargsFlag(cmd.cmdObj, opts);
    argv = parse(args, opts);
    argv.region = config.profile.region;

    let errorMsg = '';

    // // 验证flag
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
        return;
    }
    await cmd.run(argv);
    if (output.errorMsg) {
        console.error(output.errorMsg);
    } else {
        console.log(output.result);
    }
}