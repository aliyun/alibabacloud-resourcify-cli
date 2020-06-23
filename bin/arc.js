#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const path = require('path');
const fs = require('fs');
let yargs = require('yargs');
const handler = require('../handler.js');


let { cmds, descFilePath, argv } = getBasicInfo(process.argv.slice(2));
const buf = fs.readFileSync(descFilePath);
let cmdObj = JSON.parse(buf);
let params = cmdObj.param;

for (let key in cmdObj.sub) {
    yargs.command(`${cmds.join(' ')} ${key}`, cmdObj.sub[key]);
}

if (cmdObj.param) {
    transParam(yargs, '', '', params);
}

if (cmdObj.example) {
    yargs.example(cmdObj.example);
}

if (cmdObj.mapping) {
    yargs.option('profile', {
        alias: 'p'
    });
}

yargs.completion('completion', false, function (current, argv) {
    let args = [];
    if (argv._[argv._.length - 1] === '') {
        args = argv._.slice(0, argv._.length - 1);
    } else {
        args = argv._;
    }
    let { descFilePath } = getBasicInfo(args.slice(1));
    const buf = fs.readFileSync(descFilePath);
    let cmdObj = JSON.parse(buf);
    let completWords = [];
    for (let key in cmdObj.sub) {
        completWords.push(key);
    }
    for (let key in cmdObj.param) {
        completWords.push(`--${key}`);
    }
    return completWords;
});

yargs.usage(`\nUsage:\n$0 ${cmds.join(' ')}`, cmdObj.long);

yargs.parse(argv);
handler(cmds, cmdObj, yargs.argv);

function getBasicInfo(argv) {
    let cmds = [];
    let descFilePath = path.join(__dirname, '../cmd');

    for (var i in argv) {
        let arg = argv[i];
        if (arg.startsWith('-')) {
            argv = argv.slice(i);
            break;
        }
        let temPath = path.join(descFilePath, arg);
        // 目录存在，则有子命令
        if (!fs.existsSync(temPath)) {
            if (!fs.existsSync(`${temPath}.json`)) {
                argv = argv.slice(i);
                break;
            }
        }
        descFilePath = temPath;
        cmds[i] = argv[i];
    }

    if (fs.existsSync(descFilePath)) {
        if (cmds.length !== 0) {
            descFilePath = path.join(descFilePath, `${cmds[cmds.length - 1]}.json`);
        } else {
            descFilePath = path.join(descFilePath, `cmd.json`);
        }
    } else {
        descFilePath = `${descFilePath}.json`;
    }
    return { cmds, descFilePath, argv };
}

function transParam(yargs, prefix, subType, params) {
    for (var name in params) {
        if (params[name].param) {
            transParam(`${name}.`, params[name].vType, params[name].param);
            continue;
        }
        let flagName = prefix + name;
        if (params[name].shortHand) {
            yargs.alias(flagName, params[name].shortHand);
        }
        if (flagName !== name) {
            yargs.alias(flagName, name);
        }
        switch (subType) {
            case 'list':
                params[name].vType = 'list';
                break;
        }

        switch (params[name].vType) {
            case 'jsonlist', 'list':
                yargs.array(flagName);
                break;
            case 'bool':
                yargs.boolean(flagName);
                break;
            case 'number':
                yargs.number(flagName);
                break;
            default:
                yargs.string(flagName);
        }
        if (params[name].required) {
            yargs.demandOption(flagName);
        }
        if (params[name].choices) {
            yargs.choices(flagName, params[name].choices);
        }

        if (params[name].group) {
            let group = params[name].group;
            for (var i in group) {
                yargs.group(flagName, group[i]);
            }
        }

        yargs.option(flagName, {});
    }
}
