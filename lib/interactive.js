'use strict';
const inquirer = require('inquirer');
const Parse = require('./parser.js');
const util = require('util');
const i18n = require('./i18n.js');
const jsonpath = require('../lib/jsonFilter.js');

let language = 'zh';


class Interactive {
  constructor(ctx) {
    this.ctx = ctx;
    this.parser = new Parse(ctx);
    this.cmdFilePath = ctx.cmdFilePath;
    this.profileName = ctx.profileName;
    this.profile = ctx.profile;
    this.language = ctx.profile.language;
    this.cmd = require(this.cmdFilePath);
    this.parser.options = this.cmd.cmdObj.options;
    this.endInput = false;
    this.index = [];
    this.affectOpt = {};
    this.endRequiredIndex = -1;
  }

  transOpts(cmdObj) {
    if (!cmdObj.options) {
      return;
    }
    let options = cmdObj.options;
    let requiredIndex = [];
    let optionalIndex = [];
    let transed = [];
    if (cmdObj.conflicts) {
      for (let conflict of cmdObj.conflicts) {
        transed.push(...conflict.optNames);
        if (conflict.required) {
          requiredIndex.push(conflict.optNames);
          for (let optName of conflict.optNames) {
            this.cmd.cmdObj.options[optName].required = true;
          }
        } else {
          optionalIndex.push(conflict.optNames);
        }
      }
    }
    for (let optName of Object.keys(options)) {
      if (transed.includes(optName)) {
        continue;
      }
      transed.push(optName);
      let option = options[optName];
      if (option.required) {
        if (option.index) {
          if (requiredIndex[option.index]) {
            requiredIndex.push(requiredIndex[option.index]);
          }
          requiredIndex[option.index] = optName;
        } else {
          requiredIndex.push(optName);
        }
      } else {
        if (option.index) {
          if (optionalIndex[option.index]) {
            optionalIndex.push(optionalIndex[option.index]);
          }
          optionalIndex[option.index] = optName;
        } else {
          optionalIndex.push(optName);
        }
      }
      if (option.attributes && option.attributes.required) {
        for (let condition of option.attributes.required) {
          for (let k of Object.keys(condition)) {
            let result=this.parser.getOptionByName(k);
            result.option.affect=result.option.affect||[];
            result.option.affect.push(optName);
          }
        }
      }
    }
    for (let name of requiredIndex) {
      if (name) {
        this.index.push(name);
        this.endRequiredIndex++;
      }
    }
    for (let name of optionalIndex) {
      if (name) {
        this.index.push(name);
      }
    }
  }

  async startInteractive() {
    if (this.cmd.preInteractive) {
      this.cmd.preInteractive(this.ctx);
    }
    // argv input
    let cmdObj = this.cmd.cmdObj;
    let argv = [];
    if (cmdObj.args) {
      let answer = await this.argsInteractively();
      for (let arg of cmdObj.args) {
        if (answer[arg.name]) {
          argv.push(`${answer[arg.name]}`);
        }
      }
    }
    this.transOpts(cmdObj);
    let optName;
    for (; ;) {
      if (!this.index[0]) {
        break;
      }
      if (this.endRequiredIndex === -1) {
        let question = {
          type: 'list',
          choices: [...this.index, new inquirer.Separator(), '[DONE]'],
          name: 'optName',
          loop: false,
          pageSize: 10,
          message: this.lineWrap(i18n.optionalPrompt[this.language])
        };
        let answer = await inquirer.prompt([question]);
        if (answer.optName === '[DONE]') {
          break;
        }
        optName = answer.optName;
      } else {
        optName = this.index.shift();
        this.endRequiredIndex--;
      }
      if (Array.isArray(optName)) {
        let question = {
          type: 'list',
          choices: optName,
          name: 'optName',
          message: this.lineWrap(i18n.conflictPromt[this.language])
        };
        let answer = await inquirer.prompt([question]);
        optName = answer.optName;
      }
      let ok = await this.optionInteractive(optName, this.cmd.cmdObj.options[optName]);
      if (ok === undefined && this.endRequiredIndex === -1) {
        let index = this.index.indexOf(optName);
        this.index.splice(index, 1);
      }
    }
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
    let optNames = Object.keys(option.options);
    for (let opt of optNames) {
      let optName = option.name + '.' + opt;
      await this.optionInteractive(optName, option.options[opt]);
    }
  }

  async arrayInteraction(option) {
    for (let i = 0; ; i++) {
      let optName = option.name + '.' + i;
      await this.optionInteractive(optName, { vtype: option.subType, options: option.options, desc: option.desc });
      let question = {
        type: 'confirm',
        name: 'isConfig',
        message: util.format(i18n.continueConfigPromt[language], i + 2, option.name)
      };
      let answer = await inquirer.prompt([question]);
      if (!answer['isConfig']) {
        break;
      }
    }
  }

  async optionInteractive(optName, option) {
    if (option.attributes && option.attributes.show) {
      let result = this.parser.getAttribute(option.attributes.show, 'show');
      if (!result.changed) {
        console.log('该参数需满足以下条件下方可生效');
        for (let i = 0; i < option.attributes.show.length; i++) {
          let prompt = this.parser.getConditionPrompt(option.attributes.show[i]);
          let message = util.format(prompt.prompt[this.language], ...prompt.values);
          console.log(this.lineWrap(message));
          if (option.attributes.show[i + 1]) {
            console.log(this.lineWrap(i18n.orKeyWord[this.language]));
          }
        }
        return false;
      }
    }
    let message = this.lineWrap(option.desc[this.language]);
    if (option.options || option.vtype === 'array') {
      console.log(message);
      await this.optionsInteractive({ name: optName, vtype: option.vtype, subType: option.subType, options: option.options, desc: option.desc });
    } else {
      await this.optionInput(optName, option);
    }
    if (option.affect){
      for (let optName of option.affect){
        let result = this.parser.getAttribute(this.cmd.cmdObj.options[optName].attributes.required, 'required');
        if (result.changed){
          if (this.index.includes(optName)){
            let index=this.index.indexOf(optName);
            this.index.splice(index,1);
            this.index.unshift(optName);
            this.endRequiredIndex++;
          }
        }
      }
    }
  }

  async optionInput(optName, option) {
    let question = this.constructQuestion(optName, option);
    let answers = await inquirer.prompt([question]);
    let val = jsonpath.search(answers, optName);
    this.parser.setValueByName(optName, [val], this.cmd.cmdObj.options);
    console.log(this.parser.parsedValue);
  }

  constructQuestion(optName, option) {
    let question = {
      type: 'input',
      name: optName,
      message: option.desc[this.language] + '\n' + optName
    };
    if (option.filter) {
      question.filter = option.filter;
    }
    if (option.default) {
      question['default'] = option.default;
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

  async argsInteractively(cmd) {
    let questions = [];
    for (let arg of cmd.args) {
      let question = {
        type: 'input',
        name: arg.name,
        message: arg.name,
      };
      if (arg.required) {
        let err = i18n.emptyValueErr[language];
        question['validate'] = function (val) {
          if (val === '') {
            return err;
          }
          return true;
        };
      }
      questions.push(question);
    }
    let answers = await inquirer.prompt(questions);
    return answers;
  }

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