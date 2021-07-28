'use strict';

class Context {
  constructor(cmdName, cmdDef, args) {
    this.cmdName = cmdName;
    this.cmdDef = cmdDef;
    this.args = args;
  }
}

module.exports = Context;
