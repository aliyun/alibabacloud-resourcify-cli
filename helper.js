'use strict';


var ui = require('cliui')();

let lang;

const cueWord = {
    command: {
        zh: '子命令',
        en: 'command'
    },
    options: {
        zh: '选项',
        en: 'options'
    },
    required: {
        zh: '必选',
        en: 'required'
    },
    optionValue: {
        zh: '可选值',
        en: 'optional value'
    },
    example: {
        zh: '示例值',
        en: 'example'
    }
};

exports.printUsage = function (cmdObj) {
    if (cmdObj.usage){
        for (let value of cmdObj.usage){
            ui.div({
                text: value,
                padding: [0, 0, 0, 4]
            });
        }
        return;
    }
    let message = '';
    if (cmdObj.sub) {
        ui.div({
            text: `${cmdObj.use} [${cueWord.command[lang]}]`,
            padding: [0, 0, 0, 4]
        });
    }
    if (cmdObj.args || cmdObj.flags) {
        message += cmdObj.use + ' ';
    }
    if (cmdObj.args) {
        let argsUsage = '';
        for (let arg of cmdObj.args) {
            let preToken = '[';
            let sufToken = ']';
            if (arg.required) {
                preToken = '<';
                sufToken = '>';
            }
            if (arg.variable) {
                argsUsage += preToken + arg.name + '...' + sufToken;
            } else {
                argsUsage += preToken + arg.name + sufToken;
            }
            argsUsage += ' ';
        }
        message += argsUsage;
    }

    if (cmdObj.flags) {
        message += `[${cueWord.options[lang]}]`;
    }
    if (message) {
        ui.div({
            text: message,
            padding: [0, 0, 0, 4]
        });
    }
};

exports.printDesc = function (desc) {
    if (!desc) {
        return;
    }
    ui.div({
        text: desc[lang],
        padding: [1, 0, 1, 4],
        width: 50
    });
};

exports.printSubcmd = function (sub) {
    if (!sub) {
        return;
    }
    ui.div(`${cueWord.command[lang]}:`);
    for (let name in sub) {
        ui.div(
            {
                text: name,
                width: 20,
                padding: [0, 0, 0, 4]
            },
            {
                text: sub[name][lang],
                width: 30
            }
        );
    }
};

exports.printFlags = function (group, flags) {
    if (!flags.flags) {
        return;
    }
    if (group) {
        ui.div(`${name} ${cueWord.options[lang]}:`);
    } else {
        ui.div(`${cueWord.options[lang]}:`);
    }
    if (flags.required) {
        for (let flagName of flags.required) {
            exports.printFlag(flagName, flags.flags[flagName], true);
            delete flags.flags[flagName];
        }
    }
    for (let flagName in flags.flags) {
        exports.printFlag(flagName, flags.flags[flagName], false);
    }
};

exports.printFlag = function (flagName, flag, required) {
    flagName = `--${flagName}`;
    let desc = '';
    let vtype = flag.vtype || 'string';
    let choices = '';
    let requiredTip = '';
    if (required) {
        requiredTip = `<${cueWord.required[lang]}>`;
    }
    if (flag.desc) {
        desc = flag.desc[lang] || '';
    }
    if (flag.choices) {
        let str = flag.choices.join(' , ');
        choices = `[${cueWord.optionValue[lang]}: ${str}]`;
    }
    if (flag.alias) {
        flagName = `-${flag.alias},${flagName}`;
    } else {
        flagName = `   ${flagName}`;
    }

    if (flag.example) {
        desc += `\n${cueWord.example[lang]}：\n` + flag.example;
    }
    {
        ui.div(
            {
                text: flagName,
                width: 25,
                padding: [0, 4, 1, 2]
            },
            {
                text: requiredTip,
                width: 10,
                padding: [0, 4, 1, 0]
            },
            {
                text: `[${vtype}]   ${choices}`,
                width: 20,
                padding: [0, 4, 1, 0]
            },
            {
                text: desc,
                width: 50,
            }
        );
    }
};
exports.printFlagGroup = function (group) {
    if (!group) {
        return;
    }
    for (let name in group) {
        this.printFlags(name, group[name]);
    }

};

exports.printHelp = function () {
    console.log(ui.toString());
};

exports.help = function (cmdObj, language) {
    lang = language || 'zh';
    ui.div('usage:');
    exports.printUsage(cmdObj);
    exports.printDesc(cmdObj.desc);
    exports.printSubcmd(cmdObj.sub);
    exports.printFlags('', cmdObj);
    exports.printHelp();
};

