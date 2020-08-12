'use strict';

const fs = require('fs');
const path = require('path');

function getBasicInfo(argv) {
    let flag = true;
    let cmds = [];
    let descFilePath = path.join(__dirname, 'meta');

    for (var i in argv) {
        let arg = argv[i];
        if (arg === 'help') {
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

function fillYargsFlag(cmdObj, opts) {
    // 填充flag
    if (!opts) {
        opts = {
            number: [],
            boolean: [],
            string: [],
            array: [],
            alias: {},
            configuration: {
                'unknown-options-as-args': true
            }
        };
    }
    opts = fillflags(opts, cmdObj.flags);
    return opts;
}

function fillflags(opts, flagObj) {
    if (!flagObj) {
        return opts;
    }
    for (let name in flagObj) {
        if (flagObj[name].hide) {
            continue;
        }
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
        if (flagObj[name].alias) {
            opts.alias[name] = [flagObj[name].alias];
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
        return `Unknown positional parameters '${argv._.slice(len)}', expect ${len} positional parameters`;
    }

    //可选值检测
    let error=argValidate(cmdObj.args, argv._);
    if (error){
        return error;
    }

    if (cmdObj.required) {
        for (let name of cmdObj.required) {
            if (argv[name] === undefined) {
                return `The required option '--${name}' is not specified`;
            }
        }
    }

    //flag 检测
    for (let key in cmdObj.flags){
        if (argv[key]){
            flagValidate(cmdObj.flags[key],argv[key]);
        }
    }
}

function argValidate(args, argv) {
    let index = 0;
    for (index in argv) {
        let ok = true;
        let arg;
        if (args[index]) {
            arg = args[index];
            if (arg.choices) {
                ok = arg.choices.includes(argv[index]);
            }
        } else {
            arg = args[args.length - 1];
            if (arg.choices) {
                ok = arg.choices.includes(argv[index]);
            }
        }
        if (!ok) {
            return `Position parameter '${arg.name}' has optional values: ${arg.choices} `;
        }
    }
}

function flagValidate(flag,value){
    if (flag.vtype&&flag.vtype==='number'){
        if (isNaN(value)){
            return `Value should be of type number`;
        }
    }
    if (flag.choices){
        let ok=flag.choices.includes(value);
        if (!ok){
            return `flag has optional values: ${flag.choices}`;
        }
    }
}

module.exports = {
    getBasicInfo,
    fillYargsFlag,
    validate,
    fillflags,
};

