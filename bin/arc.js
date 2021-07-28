'use strict';

const ARC = require('../cmds/meta/arc');

const arc = new ARC('arc');
arc.handle(process.argv.slice(2)).then(() => {
  process.exit(0);
}, (err) => {
  console.log(err.stack);
  process.exit(-1);
});
