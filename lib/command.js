'use strict';

const i18n = require('./i18n');

class Command {
  constructor(name, def) {
    this.name = name;
    this.def = def;
    this.cmds = [];
    this.parent = undefined;
  }

  async handle(args) {
    const [sub] = args;
    // whether to delegate to sub-command
    if (sub && this.cmds.length > 0) {
      for (let i = 0; i < this.cmds.length; i++) {
        const cmd = this.cmds[i];
        if (cmd.name === sub) {
          // delegates to sub-command
          await cmd.handle(args.slice(1));
          return;
        }
      }
    }

    if (process.env.COMP_LINE) {
      const args = process.env.COMP_LINE.split(' ').slice(1);
      await this.completion(args);
      return;
    }

    await this.run(args);
  }

  async completion(args) {
    if (this.cmds.length > 0) {
      for (let i = 0; i < this.cmds.length; i++) {
        const cmd = this.cmds[i];
        console.log(cmd.name);
      }
    }

    if (this.def.options) {
      for (const key of Object.keys(this.def.options)) {
        console.log('--' + key);
      }
      // 添加全局选项
      console.log('--profile');
      console.log('--interaction');
      console.log('--region');
    }
  }

  getCommandPath() {
    const list = [this.name];
    let current = this;
    while (current.parent) {
      list.unshift(current.parent.name);
      current = current.parent;
    }

    return list;
  }

  async help(language = 'zh') {
    const ui = require('cliui')({ width: 120 });
    ui.div(`${i18n.usagePrompt[language]}:`);
    // syntax
    let syntaxes = [];
    if (this.def.usage) {
      syntaxes = this.def.usage;
    } else {
      let message = '';

      const use = this.getCommandPath().join(' ');
      if (this.def.sub) {
        syntaxes.push(`${use} [${i18n.commandPrompt[language]}]`);
      }

      if (this.def.args || this.def.options) {
        message += use + ' ';
      }
      if (this.def.args) {
        let argsUsage = '';
        for (const arg of this.def.args) {
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

      if (this.def.options) {
        message += `[${i18n.optionsPrompt[language]}]`;
      }

      if (message) {
        syntaxes.push(message);
      }
    }

    for (const value of syntaxes) {
      ui.div({
        text: value,
        padding: [0, 0, 0, 4]
      });
    }

    // description
    if (this.def.desc && this.def.desc[language]){
      ui.div({
        text: this.def.desc[language],
        padding: [1, 0, 1, 2]
      });
    }

    // sub commands
    if (this.def.sub) {
      ui.div(`${i18n.commandPrompt[language]}:`);
      const sub = this.def.sub;
      const subs = Object.keys(sub);
      for (const name of subs) {
        ui.div(
          {
            text: name,
            width: 40,
            padding: [0, 0, 0, 4]
          },
          {
            text: sub[name][language]
          }
        );
      }
    }

    // options
    if (this.def.options && Object.keys(this.def.options).length > 0) {
      ui.div({
        text: `${i18n.optionsPrompt[language]}:`,
        padding: [1, 0, 0, 0]
      });

      const options = Object.keys(this.def.options);
      for (let i = 0; i < options.length; i++) {
        let name = options[i];
        const option = this.def.options[name];
        name = '--' + name;
        let desc = '';
        const vtype = option.vtype || 'string';
        let choices = '';
        let requiredTip = '';
        if (option.required) {
          requiredTip += '*';
        }
        if (option.desc) {
          desc = option.desc[language] || '';
        }
        if (option.choices) {
          const str = option.choices.join(' , ');
          choices = `[${i18n.optionValuePrompt[language]}: ${str}]`;
        }
        if (option.alias) {
          name = `-${option.alias},${name}`;
        } else {
          name = `   ${name}`;
        }
        ui.div(
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
    }

    console.log(ui.toString());
  }

  registerCommand(cmd) {
    this.cmds.push(cmd);
    cmd.parent = this;
  }
}

module.exports = Command;