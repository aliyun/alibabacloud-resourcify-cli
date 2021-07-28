#!/usr/bin/env node

// AlibabaCloud Resourcify CLI for CS

'use strict';

const path = require('path');

const { run } = require('../lib/run.js');

run('arc-cs', path.join(__dirname, '../cmds/meta/arc/cs'), process.argv.slice(2));
