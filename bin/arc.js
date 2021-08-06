#!/usr/bin/env node

'use strict';

// AlibabaCloud Resourcify CLI

const ARC = require('../cmds/arc');

const arc = new ARC('arc');
arc.handle(process.argv.slice(2)).then(() => {
  process.exit(0);
}, (err) => {
  console.error(err.stack);
  process.exit(-1);
});
