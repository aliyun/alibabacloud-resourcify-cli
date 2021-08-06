#!/usr/bin/env node

'use strict';

// AlibabaCloud Resourcify CLI for ACK

const ACK = require('../cmds/arc/cs');

const ack = new ACK('arc-cs');
ack.handle(process.argv.slice(2)).then(() => {
  process.exit(0);
}, (err) => {
  console.error(err.stack);
  process.exit(-1);
});
