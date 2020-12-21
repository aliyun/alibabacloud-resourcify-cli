/**
 * 构建帮助信息
 */
'use strict';

const Parse = require('./parser.js');
const i18n = require('./i18n.js');

class Helper {
  constructor(ctx) {
    this.ui = require('cliui')({ width: 120 });
    this.cmdFilePath = ctx.cmdFilePath;
    this.cmdObj = require(ctx.cmdFilePath).cmdObj;
    this.rootCmd = ctx.rootCmdName;
    this.language = ctx.profile.language;
    this.cmds = ctx.cmds;
    this.parse = new Parse(ctx);
  }
  getSyntax() {
    let syntax = [];
    if (this.cmdObj.usage) {
      syntax = this.cmdObj.usage;
    } else {
      let message = '';
      let use = this.rootCmd + ' ' + this.cmds.join(' ');
      if (this.cmdObj.sub) {
        syntax.push(`${use} [${i18n.commandPrompt[this.language]}]`);
      }
      if (this.cmdObj.args || this.cmdObj.options) {
        message += use + ' ';
      }
      if (this.cmdObj.args) {
        let argsUsage = '';
        for (let arg of this.cmdObj.args) {
          let preToken = '[';
          let sufToken = ']';
          if (arg.required) {
            preToken = '<';
            sufToken = '>';
          }
          argsUsage += preToken + arg.name + sufToken;
          argsUsage += ' ';
        }
        message += argsUsage;
      }

      if (this.cmdObj.options) {
        message += `[${i18n.optionsPrompt[this.language]}]`;
      }
      if (message) {
        syntax.push(message);
      }
    }

    for (let value of syntax) {
      this.ui.div({
        text: value,
        padding: [0, 0, 0, 4]
      });
    }
  }
  getSubList() {
    if (!this.cmdObj.sub) {
      return;
    }
    this.ui.div(`${i18n.commandPrompt[this.language]}:`);
    let sub = this.cmdObj.sub;
    let subs = Object.keys(sub);
    for (let name of subs) {
      this.ui.div(
        {
          text: name,
          width: 40,
          padding: [0, 0, 0, 4]
        },
        {
          text: sub[name][this.language]
        }
      );
    }
  }

  getOptions() {
    let result = this.parse.transOpts(this.cmdObj);
    if (result.index.length === 0) {
      return;
    }
    this.ui.div(`${i18n.optionsPrompt[this.language]}:`);
    let index = result.index;
    for (let optName of index) {
      if (Array.isArray(optName)) {
        for (let name of optName) {
          this.getOneOption(name);
        }
      } else {
        this.getOneOption(optName);
      }
    }
  }

  getOneOption(name) {
    let option = this.cmdObj.options[name];
    name = '--' + name;
    let desc = '';
    let vtype = option.vtype || 'string';
    let choices = '';
    let requiredTip = '';
    if (option.required) {
      requiredTip += '*';
    }
    if (option.desc) {
      desc = option.desc[this.language] || '';
    }
    if (option.choices) {
      let str = option.choices.join(' , ');
      choices = `[${i18n.optionValuePrompt[this.language]}: ${str}]`;
    }
    if (option.alias) {
      name = `-${option.alias},${name}`;
    } else {
      name = `   ${name}`;
    }
    this.ui.div(
      {
        text: name,
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

  helper() {
    this.ui.div('usage:');
    this.getSyntax();
    this.getSubList();
    this.getOptions();
  }
}
module.exports = Helper;