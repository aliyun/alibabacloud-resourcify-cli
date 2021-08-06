'use strict';

const inquirer = require('inquirer');

const i18n = require('./i18n');
const Command = require('./command');
const { loadContext } = require('./context');

module.exports = class extends Command {
  constructor(name, def) {
    super(name, def);
  }

  async handle(args) {
    const ctx = loadContext(args, this.def.options);
    if (ctx.parsed.has('interaction')) {
      await this.interaction(ctx);
      return;
    }

    const [sub] = ctx.argv;
    if (sub === 'help') {
      await this.help();
      return;
    }

    await this.run(ctx);
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

  async interactionArgvs(ctx) {
    const argv = [];
    if (this.def.args) {
      const questions = [];
      for (const arg of this.def.args) {
        const question = {
          type: 'input',
          name: arg.name,
          message: arg.message || arg.name,
        };
        if (arg.required) {
          const err = i18n.emptyValueErr[ctx.language];
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
      for (const arg of this.def.args) {
        argv.push(`${answers[arg.name]}`);
      }
    }
    return argv;
  }

  async isRun(ctx) {
    const answer = await inquirer.prompt([{
      type: 'list',
      name: 'isRun',
      message: i18n.isRunPromt[ctx.language],
      choices: [
        { name: i18n.runAndShowPrompt[ctx.language], value: true },
        { name: i18n.showPrompt[ctx.language], value: false }
      ]
    }]);

    return answer.isRun;
  }

  async interactionOptions(ctx) {
    const options = [];
    const choices = [];
    for (const [name, option] of Object.entries(this.def.options)) {
      if (!option.required) {
        option.vtype = option.vtype || 'string';
        choices.push({
          name: `${name} [${option.vtype}] ${option.desc[ctx.language]}`,
          value: name,
          short: name
        });
      }
    }

    while (choices.length > 0) {
      const question = {
        type: 'list',
        choices: [...choices, new inquirer.Separator, '[DONE]'],
        name: 'optName',
        loop: false,
        pageSize: 10,
        message: this.lineWrap(i18n.optionalPrompt[ctx.language])
      };

      const answer = await inquirer.prompt([question]);
      if (answer.optName === '[DONE]') {
        break;
      }

      const ok = await this.optionInteractive(ctx, answer.optName);
      options.push(`--${answer.optName} ${ok}`);
      const index = choices.findIndex((item) => {
        return item.value === answer.optName;
      });
      if (index !== -1) {
        choices.splice(index, 1);
      }
    }

    return options;
  }

  constructQuestion(ctx, optName) {
    const language = ctx.language;
    const option = this.def.options[optName];
    const question = {
      type: 'input',
      name: optName,
      message: option.desc[language] + '\n' + optName
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

  async optionInteractive(ctx, name) {
    // const option = this.def.options[name];
    // let message = this.lineWrap(option.desc[ctx.language]);
    const answers = await inquirer.prompt([this.constructQuestion(ctx, name)]);
    // if (option.options || option.vtype === 'array') {
    //   console.log(message);
    //   await this.optionsInteractive({ name: optName, vtype: option.vtype, subType: option.subType, options: option.options, desc: option.desc });
    // } else {
    //   await this.optionInput(optName, option);
    // }
    return answers[name];
  }

  async interaction(ctx) {
    const argv = await this.interactionArgvs(ctx);

    const options = await this.interactionOptions(ctx);

    const isRun = await this.isRun(ctx);
    let output = this.getCommandPath().join(' ');
    if (argv.length > 0) {
      output += ` ${argv.join(' ')}`;
    }

    if (options.length > 0) {
      output += ` ${options.join(' ')}`;
    }

    console.log(output);
    if (isRun) {
      await this.run(loadContext([...argv, ...options], this.def.options));
    }
  }
};
