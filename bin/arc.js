#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const path = require('path');

const { run } = require('../lib/run.js');

// 运行
run('arc', path.join(__dirname, '../cmds/meta/arc'), process.argv.slice(2));
