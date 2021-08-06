#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const ARCTool = require('../cmds/arc-tool');

const c = new ARCTool('arc-tool');
c.handle(process.argv.slice(2)).then(() => {
  process.exit(0);
}, (err) => {
  console.error(err.stack);
  process.exit(-1);
});
