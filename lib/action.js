'use strict';

const Command = require('./command');
const { loadContext } = require('./context');

module.exports = class extends Command {
  constructor(name, def) {
    super(name, def);
  }

  async handle(args) {
    const ctx = loadContext(args, this.def.options);
    if (ctx.parsed.has('interaction')) {
      await this.interaction();
      return;
    }

    const [sub] = ctx.argv;
    if (sub === 'help') {
      await this.help();
      return;
    }

    await this.run(ctx);
  }

  async interaction() {
    console.log(this.def);
    console.log('enter activ');
  }
};
