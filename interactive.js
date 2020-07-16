'use strict';
const config = require('./config.js');
const inquirer = require('inquirer');
exports.runInteractively = async function (cmdObj, argv) {
    let args = [];
    let questions = [];
    if (cmdObj.args) {
        for (let arg of cmdObj.args) {
            let question = {
                type: 'input',
                name: arg.name,
                message: arg.name,
                askAnswered: true
            };
            if (arg.required) {
                question['validate'] = function (val) {
                    if (val === '') {
                        return '该位置参数不能为空';
                    }
                    return true;
                };
            }
            questions.push(question);
        }
        await inquirer.prompt(questions).then(answers => {
            for (let arg in cmdObj.args) {
                if (answers[arg.name]) {
                    args.push(`${answers[arg.name]}`);
                }
            }
        });
    }
    questions=[];
    if (cmdObj.required) {
        for (let key of cmdObj.required) {
            let question = {
                type: 'input',
                name: key,
                message: cmdObj.flags[key].desc[config.profile.language] + '\n' + key,
                askAnswered: true
            };
            if (cmdObj.flags[key].vtype && cmdObj.flags[key].vtype === 'boolean') {
                question['type'] = 'list';
                question['choices'] = ['true', 'false'];
            }
            if (cmdObj.flags[key].choices) {
                question['type'] = 'list';
                question['choices'] = cmdObj.flags[key].choices;
            }
            question['validate'] = function (val) {
                if (val === '') {
                    return '该字段不能为空';
                }
                return true;
            };
            questions.push(question);
            delete cmdObj.flags[key];
        }
    }
    for (let key in cmdObj.flags) {
        if (cmdObj.flags[key].hide) {
            continue;
        }
        let question = {
            type: 'input',
            name: key,
            message: cmdObj.flags[key].desc[config.profile.language] + '\n' + key,
            askAnswered: true
        };
        if (cmdObj.flags[key].vtype && cmdObj.flags[key].vtype === 'boolean') {
            question['type'] = 'list';
            question['choices'] = ['true', 'false'];
        }
        if (cmdObj.flags[key].choices) {
            question['type'] = 'list';
            question['choices'] = cmdObj.flags[key].choices;
        }
        questions.push(question);
    }
    if (argv.profile) {
        args.push(`--profile=${argv.profile}`);
    }
    if (argv.region) {
        args.push(`--region=${argv.region}`);
    }
    await inquirer.prompt(questions).then(answers => {
        for (let key in answers) {
            if (answers[key]) {
                args.push(`--${key}=${answers[key]}`);
            }
        }
    });
    let isRun;
    await inquirer.prompt([
        {
            type: 'confirm',
            name: 'isRun',
            message: 'Do you want run now?',
            default: false
        }
    ]).then(answers => {
        isRun = answers.isRun;
    });
    return { args, isRun };
};