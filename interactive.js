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
        let answers = await inquirer.prompt(questions);
        for (let arg in cmdObj.args) {
            if (answers[arg.name]) {
                args.push(`${answers[arg.name]}`);
            }
        }
    }
    questions = [];
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
            if (cmdObj.flags[key].default) {
                question['default'] = cmdObj.flags[key].default;
            }
            question['validate'] = function (val) {
                if (val === '') {
                    return '该字段不能为空';
                }
                return true;
            };
            questions.push(question);
        }
    }
    for (let key in cmdObj.flags) {
        if (cmdObj.required.includes(key) || cmdObj.flags[key].hide) {
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
        if (cmdObj.flags[key].default) {
            question['default'] = cmdObj.flags[key].default;
        }
        questions.push(question);
    }

    let answers = await inquirer.prompt(questions);
    for (let key in answers) {
        if (answers[key]) {
            args.push(`--${key}=${answers[key]}`);
        }
    }
    if (argv.profile) {
        args.push(`--profile=${argv.profile}`);
    }
    if (argv.region && !answers['region']) {
        args.push(`--region=${argv.region}`);
    }

    answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'isRun',
            message: 'Do you want run now?',
            default: false
        }]);
    let isRun = answers.isRun;

    return { args, isRun };
};