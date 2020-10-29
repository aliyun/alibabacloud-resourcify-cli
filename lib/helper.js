'use strict';

const parser = require('./parser.js');

var ui = require('cliui')({ width: 120 });
let lang = 'zh';
let rootCmd = '';
let cmds = [];
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

function getSyntax(cmdObj) {
  let syntax = [];
  if (cmdObj.usage) {
    return cmdObj.usage;
  }
  let message = '';
  let use = rootCmd + ' ' + cmds.join(' ');
  if (cmdObj.sub) {
    syntax.push(`${use} [${cueWord.command[lang]}]`);
  }
  if (cmdObj.args || cmdObj.options) {
    message += use + ' ';
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

  if (cmdObj.options) {
    message += `[${cueWord.options[lang]}]`;
  }
  if (message) {
    syntax.push(message);
  }
  return syntax;
}



exports.printSubcmdToUi = function (sub) {
  if (!sub) {
    return;
  }
  ui.div(`${cueWord.command[lang]}:`);
  for (let name in sub) {
    ui.div(
      {
        text: name,
        width: 40,
        padding: [0, 0, 0, 4]
      },
      {
        text: sub[name][lang]
      }
    );
  }
  return ui;
};

exports.printFlagsToUi = function (opts) {
  if (opts._transed.length === 0) {
    return;
  }
  ui.div(`${cueWord.options[lang]}:`);
  if (opts._required) {
    for (let flagName of opts._required) {
      if (Array.isArray(flagName)) {
        for (let flag of flagName) {
          getFlag(flag, opts[flag], false);
          delete opts[flag];
        }
        continue;
      }
      getFlag(flagName, opts[flagName], true);
      delete opts[flagName];
    }
  }
  for (let flagName of opts._transed) {
    if (!opts[flagName]) {
      continue;
    }
    getFlag(flagName, opts[flagName], false);
    delete opts[flagName];
  }
  return ui;
};

function getFlag(flagName, flag, required) {
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
  if (requiredTip) {
    requiredTip = '*';
  } else {
    requiredTip = '';
  }
  ui.div(
    {
      text: flagName,
      width: 40,
      padding: [0, 4, 0, 2],
    },
    {
      text: `${requiredTip}[${vtype}]   ${choices}`,
      width: 20,
      padding: [0, 4, 0, 0]
    },
    {
      text: desc,
    }
  );
}

exports.printHelp = function () {
  console.log(ui.toString());
};

function printUsagePromtToUi() {
  ui.div('usage:');
}

exports.setLang = function (language) {
  if (language) {
    lang = language;
  }
};
exports.setRootCmd = function (cmdName) {
  if (cmdName) {
    rootCmd = cmdName;
  }
};
exports.setCmds = function (cmdList) {
  if (cmdList) {
    cmds = cmdList;
  }
};
exports.help = function (ctx) {
  exports.setLang(ctx.profile.language);
  exports.setCmds(ctx.cmds);
  exports.setRootCmd(ctx.rootCmdName);
  let cmdObj = require(ctx.cmdFilePath).cmdObj;
  let opts = parser.transOpts(cmdObj.options);
  printUsagePromtToUi();
  exports.printSyntaxToUi(cmdObj);
  exports.printDescToUi(cmdObj.desc);
  exports.printSubcmdToUi(cmdObj.sub);
  exports.printFlagsToUi(opts);
  exports.printHelp();
};

exports.printSyntaxToUi = function (cmdObj) {
  const syntax = getSyntax(cmdObj);
  for (let value of syntax) {
    ui.div({
      text: value,
      padding: [0, 0, 0, 4]
    });
  }
  return ui;
};

exports.printDescToUi = function (desc) {
  if (!desc) {
    return;
  }
  ui.div({
    text: desc[lang],
    padding: [1, 0, 1, 4],
    width: 50
  });
  return ui;
};