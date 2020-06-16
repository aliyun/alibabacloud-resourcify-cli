#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const path = require('path');
const fs = require('fs');
const yargs = require('yargs');
const { printUsage } = require('../helper.js');
const handler = require('../handler.js');

let argv = process.argv.slice(2);
let cmds = [];
let descFilePath = path.join(__dirname, '../cmd');
if (argv.length === 0) {
    printUsage();
    process.exit(0);
}

for (var i in argv) {
    let arg = argv[i];
    if (arg.startsWith('-')) {
        argv = argv.slice(i);
        break;
    }
    let temPath = path.join(descFilePath, arg);
    if (!fs.existsSync(temPath)) {
        if (!fs.existsSync(`${temPath}.json`)) {
            argv = argv.slice(i);
            break;
        }
    }
    descFilePath = temPath;
    cmds[i] = argv[i];
}

const buf = fs.readFileSync(`${descFilePath}.json`);
let cmdObj = JSON.parse(buf);
let params = cmdObj.param;

yargs.alias('help', 'h');
transParam('', '', params);

if (cmdObj.mapping) {
    yargs.option('profile', {
        alias: 'p'
    });
}

yargs.parse(argv);
handler(cmds, cmdObj, yargs.argv);

function transParam(prefix, subType, params) {
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
// switch (command) {
//     case 'version':
//         const pkg = require('../package.json');
//         console.log(`arc version ${pkg.version}`);
//         process.exit(0);
//         break;
//     case 'help':
//         printUsage();
//         process.exit(0);
//         break;
//     default:
//         break;
// }

// // arc product resource_type action --parameter-name=value
// const [product, resourceType, action, ...args] = argv;

// const products = require('../products.js');

// if (!products.has(product)) {
//     console.error(`product(${product}) is not registered in CLI.`);
//     process.exit(-1);
// }

// const resourceTypes = products.get(product);

// if (!resourceTypes.has(resourceType)) {
//     console.error(`product(${product})/${resourceType} is not registered in CLI.`);
//     process.exit(-1);
// }

// const actions = resourceTypes.get(resourceType);

// if (!actions.has(action)) {
//     console.error(`product(${product})/${resourceType}/${action} is not registered in CLI.`);
//     process.exit(-1);
// }

// function loadMethod(product, resourceType, action) {
//     const m = require(path.join(__dirname, '../meta', product, resourceType));
//     return m[action];
// }

// function resolveParameters(args) {
//     return {};
// }

// const method = loadMethod(product, resourceType, action);
// const parameters = resolveParameters(args);
// method(parameters).then((result) => {
//     console.log(result);
// });
