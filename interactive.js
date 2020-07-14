'use strict';
const readline = require('readline-sync');

exports.runInteractively = function (cmdObj, argv) {
    let args = [];
    if (cmdObj.args) {
        for (let arg of cmdObj.args) {
            for (; ;) {
                let value = readline.question(`${arg.name}: `);
                if (arg.required && !value) {
                    console.log('This args is required, please re-enter\n');
                    continue;
                }
                if (value) {
                    args.push(value);
                }
                break;
            }
        }
    }
    if (cmdObj.required) {
        for (let key of cmdObj.required) {
            if (argv[key]) {
                continue;
            }
            for (; ;) {
                let value = readline.question(`${key} <required>: `);
                if (!value) {
                    console.log('This option is required, please re-enter\n');
                    continue;
                }
                args.push(`--${key}=${value}`);
                break;
            }
        }
    }
    for (let key in cmdObj.flags) {
        if (argv[key]) {
            continue;
        }
        let value = readline.question(`${key}: `);
        if (!value) {
            continue;
        }
        argv[key] = value;
        args.push(`--${key}=${value}`);
    }
    if (argv.profile) {
        args.push(`--profile=${argv.profile}`);
    }
    if (argv.region) {
        args.push(`--region=${argv.region}`);
    }
    let isRun = readline.question(`Do you want run now(y/n): `);
    return { args, isRun };
};