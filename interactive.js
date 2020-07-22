'use strict';
const config = require('./config.js');
const inquirer = require('inquirer');
let answers = {};
let cmd = {};
exports.runInteractively = async function (cmdObj, argv) {
    cmd = cmdObj;
    let args = [];
    if (cmd.args) {
        let answer = await argsInteractively(cmd);
        for (let arg in cmd.args) {
            if (answer[arg.name]) {
                args.push(`${answers[arg.name]}`);
            }
        }
    }

    if (cmd.required) {
        for (let key of cmd.required) {
            let value = await flagInteract(key, cmd.flags[key], true);
            if (cmd.relationship && cmd.relationship[key]) {
                await relationInteract(key, value);
            }
        }
    }

    if (cmd.conflicts) {
        for (let conflict of cmd.conflicts) {
            await conflictInteract(conflict);
        }
    }

    if (cmd.relationship) {
        for (let key in cmd.relationship) {
            if (!cmd.flags[key]) {
                continue;
            }
            let value = await flagInteract(key, cmd.flags[key]);
            if (cmd.relationship && cmd.relationship[key]) {
                await relationInteract(key, value);
            }
        }
    }

    for (let key in cmd.flags) {
        if (cmd.flags[key].hide) {
            continue;
        }
        if (cmd.flags[key].unchanged) {
            continue;
        }
        await flagInteract(key, cmd.flags[key]);
    }

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

async function argsInteractively(cmd) {
    let questions = [];
    for (let arg of cmd.args) {
        let question = {
            type: 'input',
            name: arg.name,
            message: arg.name,
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
    return answers;
}

async function relationInteract(key, value) {
    let meet = false;
    for (let index in cmd.relationship[key]) {
        let relation = cmd.relationship[key][index];
        switch (relation.symbol) {
            case 'equal':
                if (value === relation.value) {
                    meet = true;
                }
                break;
            case 'contain':
                if (value.includes(relation.value)) {
                    meet = true;
                }
        }
        for (let flag of relation.sufficient) {
            if (meet) {
                let tempValue = await flagInteract(flag, cmd.flags[flag], true);
                if (cmd.relationship[flag]) {
                    await relationInteract(flag, tempValue);
                }
            } else {
                if (relation.necessary && relation.necessary.includes(flag)) {
                    let tempValue = await flagInteract(flag, cmd.flags[flag]);
                    if (cmd.relationship[flag]) {
                        await relationInteract(flag, tempValue);
                    }
                } else {
                    deleteSufficient(flag, index);
                }
            }
        }
    }
}

async function flagInteract(key, flag, required) {
    let question = {
        type: 'input',
        name: key,
        message: flag.desc[config.profile.language] + '\n' + key,
        askAnswered: true
    };
    if (flag.vtype && flag.vtype === 'boolean') {
        question['type'] = 'list';
        if (required) {
            question['choices'] = ['true', 'false'];
        } else {
            question['choices'] = ['true', 'false', 'default'];
            question['default'] = undefined;
            question['filter'] = function (val) {
                if (val === 'default') {
                    return undefined;
                }
                return val;
            };
        }
    }
    if (flag.choices) {
        question['type'] = 'list';
        question['choices'] = flag.choices;
    }
    if (flag.default) {
        question['default'] = flag.default;
    }
    if (required) {
        question['validate'] = function (val) {
            if (val === '') {
                return '该字段不能为空';
            }
            return true;
        };
    }
    let answer = await inquirer.prompt([question]);
    delete cmd.flags[key];
    answers[key] = answer[key];
    return answer[key];
}

async function conflictInteract(conflict) {
    if (!conflict.required) {
        conflict.flags.push('NONE');
    }
    let question = {
        type: 'list',
        name: 'conflict',
        message: '以下选项具有冲突，请选择其中一项',
        choices: conflict.flags,
        askAnswered: true
    };
    let answer = await inquirer.prompt([question]);
    console.log(answer);
    if (answer.conflict === 'NONE') {
        return;
    }
    let value = await flagInteract(answer.conflict, cmd.flags[answer.conflict], conflict.required);
    if (cmd.relationship && cmd.relationship[answer.conflict]) {
        await relationInteract(answer.conflict, value);
    }
}


function deleteSufficient(key, index) {
    delete cmd.flags[key];
    if (cmd.relationship && cmd.relationship[key]) {
        for (let flag of cmd.relationship[key][index].sufficient) {
            deleteSufficient(flag);
        }
    }
}