#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const path = require('path');

const { run } = require('../lib/run.js');

run('arc-tool', path.join(__dirname, 'cmds/meta/arc-tool'));
