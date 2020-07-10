'use strict';

const fs = require('fs');
const path = require('path');

function getBasicInfo(argv) {
    let flag = true;
    let cmds = [];
    let descFilePath = path.join(__dirname, 'meta');

    for (var i in argv) {
        let arg = argv[i];
        if (arg==='help'){
            cmds[i] = argv[i];
            argv = argv.slice(i);
            flag = false;
            break;
        }
        if (arg.startsWith('-')) {
            argv = argv.slice(i);
            flag = false;
            break;
        }
        let temPath = path.join(descFilePath, arg);
        if (!fs.existsSync(temPath)) {
            if (!fs.existsSync(`${temPath}.js`)) {
                argv = argv.slice(i);
                flag = false;
                break;
            }
        }
        descFilePath = temPath;
        cmds[i] = argv[i];
    }
    if (flag) {
        argv = [];
    }
    descFilePath = `${descFilePath}.js`;
   
    return { cmds, descFilePath, argv };
}

function fillYargsFlag(cmdObj) {
    // 填充flag
    let opts = {
        number: [],
        boolean: [],
        string: [],
        array: [],
        configuration: {
            'unknown-options-as-args': true
        }
    };
    opts = fillGroup(opts, cmdObj.group);
    opts = fillflags(opts, cmdObj.flags);
    return opts;
}

function fillGroup(opts, group) {
    if (!group) {
        return opts;
    }
    for (let name in group) {
        opts = this.fillflags(opts, group[name]);
    }
    return opts;
}

function fillflags(opts, flagObj) {
    if (!flagObj) {
        return opts;
    }
    for (let name in flagObj) {
        switch (flagObj[name].vtype) {
            case 'number':
                opts['number'].push(name);
                break;
            case 'boolean':
                opts['boolean'].push(name);
                break;
            case 'array':
                opts['array'].push(name);
                break;
            case 'numberArray':
                opts['array'].push({ key: name, number: true });
                break;
            default:
                opts['string'].push(name);
        }
    }
    return opts;
}

function validate(cmdObj, argv) {
    let needLen = 0;
    let len = 0;
    let variablelen = false;
    for (let key in cmdObj.args) {
        len++;
        if (cmdObj.args[key].required) {
            needLen++;
        }
        if (cmdObj.args[key].variable) {
            variablelen = true;
        }
    }
    if (argv._.length < needLen) {
        return 'Missing required position parameter';
    }

    for (let key of argv._) {
        if (key.startsWith('-')) {
            return `Unknown flag '${key}'`;
        }
    }
    if (!variablelen && argv._.length > len) {
        return `Unknown positional parameters, expect ${len} positional parameters`;
    }

    //可选值检测
    let index=0;
    for (index in argv._){
        let ok=true;
        let arg;
        if (cmdObj.args[index]){
            arg=cmdObj.args[index];
            if (arg.choices){
                ok=arg.choices.includes(argv._[index]);
            }
        }else{
            arg=cmdObj.args[cmdObj.args.length-1];
            if (arg.choices){
                ok=arg.choices.includes(argv._[index]);
            }
        }
        if (!ok){
            return `Position parameter '${arg.name}' has optional values: ${arg.choices} `;
        }
    }

    if (cmdObj.required){
        for (let name of cmdObj.required){
            if (!argv[name]){
                return `The required option '--${name}' is not specified`;
            }
        }
    }
    // TODO group flag 检测
    return '';
}

module.exports = {
    getBasicInfo,
    fillYargsFlag,
    validate,
    fillflags,
    fillGroup
};