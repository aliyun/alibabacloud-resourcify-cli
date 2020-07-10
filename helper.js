'use strict';


var ui = require('cliui')();

exports.printUsage = function (cmdObj) {
    let message = '';
    if (cmdObj.sub) {
        ui.div({
            text:`${cmdObj.use} [command]`,
            padding:[0,0,0,4]
        });
    }
    if (cmdObj.args||cmdObj.flags){
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
        message += '[options]';
    }
    if (message){
        ui.div({
            text:message,
            padding:[0,0,0,4]
        });
    }
};

exports.printDesc = function (desc) {
    if (!desc) {
        return;
    }
    ui.div({
       text:desc['zh'],
       padding:[1,0,1,4],
       width:50
    });
};

exports.printSubcmd = function (sub) {
    if (!sub) {
        return;
    }
    ui.div('command:');
    for (let name in sub) {
        ui.div(
            {
                text: name,
                width: 20,
                padding:[0,0,0,4]
            },
            {
                text: sub[name]['zh'],
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
        ui.div(`options of ${name}:`);
    } else {
        ui.div(`options:`);
    }
    if (flags.required){
        for (let flagName of flags.required) {
            exports.printFlag(flagName,flags.flags[flagName], true);
            delete flags.flags[flagName];
        }
    }
    for (let flagName in flags.flags) {
        exports.printFlag(flagName,flags.flags[flagName], false);
    }
};

exports.printFlag = function (flagName,flag, required) {
    flagName = `--${flagName}`;
    let desc = '';
    let vtype = flag.vtype || 'string';
    let choices = '';
    let requiredTip = '';
    if (required) {
        requiredTip = '<必选>';
    }
    if (flag.desc) {
        desc = flag.desc['zh'] || '';
    }
    if (flag.choices) {
        let str = flag.choices.join(' , ');
        choices = `[可选值：${str}]`;
    }
    if (flag.alias) {
        flagName = `-${flag.alias},${flagName}`;
    } else {
        flagName = `   ${flagName}`;
    }

    if (flag.example) {
        desc += '\n示例值：\n' + flag.example;
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

exports.help = function (cmdObj) {
    ui.div('usage:');
    exports.printUsage(cmdObj);
    exports.printDesc(cmdObj.desc);
    exports.printSubcmd(cmdObj.sub);
    exports.printFlags('', cmdObj);
    exports.printHelp();
};

