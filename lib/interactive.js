'use strict';
const inquirer = require('inquirer');
const Parse = require('./parser.js');
const util = require('util');
const i18n = require('./i18n.js');
const jsonpath = require('../lib/json_filter.js');

class Interactive {
  constructor(ctx) {
    this.ctx = ctx;
    this.parser = new Parse(ctx);
    this.cmdFilePath = ctx.cmdFilePath;
    this.profileName = ctx.profileName;
    this.profile = ctx.profile;
    this.cmdStr = '';
    this.isRun = false;
    this.argv = [];
    this.language = ctx.profile.language;
    this.cmd = require(this.cmdFilePath);
    this.parser.options = this.cmd.cmdObj.options;
    this.endInput = false;
    this.index = [];
    this.affectOpt = {};
    this.endRequiredIndex = -1;
  }

  async startInteractive() {
    if (this.cmd.preInteractive) {
      this.cmd.preInteractive(this.ctx);
    }
    // argv input
    const cmdObj = this.cmd.cmdObj;
    if (cmdObj.args) {
      const answer = await this.argsInteractively();
      for (const arg of cmdObj.args) {
        if (answer[arg.name]) {
          this.argv.push(`${answer[arg.name]}`);
        }
      }
    }

    const result = this.parser.transOpts(cmdObj);
    this.index = result.index,
    this.endRequiredIndex = result.endRequiredIndex;
    let optName;
    for (; ;) {
      if (!this.index[0]) {
        break;
      }
      if (this.endRequiredIndex === -1) {
        const choices = [];
        for (const name of this.index) {
          if (Array.isArray(name)) {
            choices.push({
              name: name.join(' | '),
              value: name,
              short: name.join(' | ')
            });
            continue;
          }
          const option = this.cmd.cmdObj.options[name];
          option.vtype = option.vtype || 'string';
          choices.push({
            name: `${name} [${option.vtype}] ${option.desc[this.language]}`,
            value: name,
            short: name
          });
        }
        const question = {
          type: 'list',
          choices: [...choices, new inquirer.Separator, '[DONE]'],
          name: 'optName',
          loop: false,
          pageSize: 10,
          message: this.lineWrap(i18n.optionalPrompt[this.language])
        };
        const answer = await inquirer.prompt([question]);
        if (answer.optName === '[DONE]') {
          break;
        }
        optName = answer.optName;
      } else {
        optName = this.index.shift();
        this.endRequiredIndex--;
      }
      let currentOptName = optName;
      if (Array.isArray(optName)) {
        const question = {
          type: 'list',
          choices: optName,
          name: 'optName',
          message: this.lineWrap(i18n.conflictPromt[this.language])
        };
        const answer = await inquirer.prompt([question]);
        currentOptName = answer.optName;
      }
      const ok = await this.optionInteractive(currentOptName, this.cmd.cmdObj.options[currentOptName]);
      if (ok === undefined && this.endRequiredIndex === -1) {
        const index = this.index.indexOf(optName);
        if (index >= 0) {
          this.index.splice(index, 1);
        }
      }
    }

    const answer = await inquirer.prompt([{
      type: 'list',
      name: 'isRun',
      message: i18n.isRunPromt[this.language],
      choices: [
        { name: i18n.runAndShowPrompt[this.language], value: true },
        { name: i18n.showPrompt[this.language], value: false }
      ]
    }]);
    this.isRun = answer.isRun;

    this.cmdStr = this.ctx.rootCmdName + ' ' + this.ctx.cmds.join(' ') + ' ' + this.argv.join(' ') + ' ';
    const subs = Object.keys(this.parser.parsedValue);
    for (const key of subs) {
      let value;
      if (this.cmd.cmdObj.options[key].unchanged) {
        continue;
      }
      if (typeof this.parser.parsedValue[key] === 'object') {
        value = `'${JSON.stringify(this.parser.parsedValue[key])}'`;
      } else {
        value = this.parser.parsedValue[key];
      }
      this.cmdStr = this.cmdStr + `--${key} ${value} `;
      
    }
    if (this.parser.parsedValue.region === undefined) {
      this.parser.parsedValue.region = this.profile.region;
    } else {
      this.profile.region = this.parser.parsedValue.region;
    }

    // mappingValue
    this.parser.valueToAPIStruct(this.parser.options, this.parser.parsedValue, this.parser.mappingValue);
  }

  async optionsInteractive(option) {
    switch (option.vtype) {
    case 'map':
      await this.mapInteraction(option);
      break;
    case 'array':
      await this.arrayInteraction(option);
    }
  }

  async mapInteraction(option) {
    const optNames = Object.keys(option.options);
    for (const opt of optNames) {
      const optName = option.name + '.' + opt;
      await this.optionInteractive(optName, option.options[opt]);
    }
  }

  async arrayInteraction(option) {
    for (let i = 0; ; i++) {
      const optName = option.name + '.' + i;
      await this.optionInteractive(optName, { vtype: option.subType, options: option.options, desc: option.desc });
      if (option.maxindex) {
        if (i === option.maxindex) {
          break;
        }
      }
      const question = {
        type: 'confirm',
        name: 'isConfig',
        message: util.format(i18n.continueConfigPromt[this.language], i + 2, option.name)
      };
      const answer = await inquirer.prompt([question]);
      if (!answer['isConfig']) {
        break;
      }
    }
  }

  async optionInteractive(optName, option) {
    if (option.attributes && option.attributes.show) {
      const result = this.parser.getAttribute(option.attributes.show, 'show');
      if (!result.changed) {
        console.log(i18n.conditionNotMetPrompt[this.language]);
        for (let i = 0; i < option.attributes.show.length; i++) {
          const prompt = this.parser.getConditionPrompt(option.attributes.show[i]);
          const message = util.format(prompt.prompt[this.language], ...prompt.values);
          console.log(this.lineWrap(message));
          if (option.attributes.show[i + 1]) {
            console.log(this.lineWrap(i18n.orKeyWord[this.language]));
          }
        }
        return false;
      }
    }
    
    if (option.attributes && option.attributes.required) {
      const result = this.parser.getAttribute(option.attributes.required, 'required');
      if (result.changed) {
        option.required = true;
      }
    }
    const message = this.lineWrap(option.desc[this.language]);
    if (option.options || option.vtype === 'array') {
      console.log(message);
      await this.optionsInteractive({ name: optName, vtype: option.vtype, subType: option.subType, options: option.options, desc: option.desc });
    } else {
      await this.optionInput(optName, option);
    }
    if (option.affect) {
      for (const optName of option.affect) {
        const result = this.parser.getAttribute(this.cmd.cmdObj.options[optName].attributes.required, 'required');
        if (result.changed) {
          if (this.index.includes(optName)) {
            this.cmd.cmdObj.options[optName].required = true;
            const index = this.index.indexOf(optName);
            this.index.splice(index, 1);
            this.index.unshift(optName);
            this.endRequiredIndex++;
          }
        }
      }
    }
  }

  async optionInput(optName, option) {
    const question = this.constructQuestion(optName, option);
    const answers = await inquirer.prompt([question]);
    const val = jsonpath.search(answers, optName);
    if (val === '') {
      return;
    }
    this.parser.setValueByName(optName, [val], this.cmd.cmdObj.options);
  }

  constructQuestion(optName, option) {
    const language = this.language;
    const question = {
      type: 'input',
      name: optName,
      message: option.desc[this.language] + '\n' + optName
    };
    if (option.filter) {
      question.filter = option.filter;
    }
    if (option.default !== undefined) {
      question['default'] = option.default;
      if (option.vtype === 'boolean') {
        if (option.default === true) {
          question['default'] = 'true';
        } else {
          question['default'] = 'false';
        }
      }
    }
    if (option.choices) {
      question['type'] = 'list';
      question['choices'] = option.choices;
      question.loop = false;
    }
    if (option.vtype === 'boolean') {
      question['type'] = 'list';
      question['choices'] = ['true', 'false'];
    } else {
      if (option.required) {
        if (option.vtype === 'number') {
          question['validate'] = function (val) {
            if (!val || val === '') {
              return i18n.emptyValueErr[language];
            }
            if (isNaN(+val)) {
              return i18n.notNumberErr[language];
            }
            return true;
          };
        } else {
          question['validate'] = function (val) {
            if (!val || val === '') {
              return i18n.emptyValueErr[language];
            }
            return true;
          };
        }
      } else {
        if (option.vtype === 'number') {
          question['validate'] = function (val) {
            if (isNaN(+val)) {
              return i18n.notNumberErr[language];
            }
            return true;
          };
        }
      }
    }
    return question;
  }

  async argsInteractively() {
    const questions = [];
    for (const arg of this.cmd.cmdObj.args) {
      const question = {
        type: 'input',
        name: arg.name,
        message: arg.name,
      };
      if (arg.required) {
        const err = i18n.emptyValueErr[this.language];
        question['validate'] = function (val) {
          if (val === '') {
            return err;
          }
          return true;
        };
      }
      questions.push(question);
    }
    const answers = await inquirer.prompt(questions);
    return answers;
  }

  // 自适应行宽
  lineWrap(message) {
    var ui = require('cliui')({ width: 80 });
    ui.div({
      text: message,
      padding: [0, 0, 0, 0],
    });
    return ui.toString();
  }
}
module.exports = Interactive;