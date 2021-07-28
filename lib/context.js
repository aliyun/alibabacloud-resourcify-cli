'use strict';

class Context {
  constructor(cmdName, filePath) {
    this.rootCmdName = cmdName;
    this.cmdFilePath = filePath;
  }
}

module.exports = Context;
