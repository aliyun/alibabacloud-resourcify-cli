#!/usr/bin/env node

'use strict';

// AlibabaCloud Resourcify CLI for ACK

const ACK = require('../cmds/meta/arc/cs');

const ack = new ACK('arc-ack');
ack.handle(process.argv.slice(2)).then(() => {
  process.exit(0);
}, (err) => {
  console.log(err.stack);
  process.exit(-1);
});