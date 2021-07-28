'use strict';

const ARC = require('../cmds/meta/arc_cmd');

async function main() {
  const arc = new ARC('arc');
  await arc.handle(process.argv.slice(2));
}

main().then(() => {
  process.exit(0);
}, (err) => {
  console.log(err.stack);
  process.exit(-1);
});
