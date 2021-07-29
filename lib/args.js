'use strict';

exports.parse = function (args, def) {
  const parsed = {};
  const argv = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const [key, value] = arg.split('=');
      parsed[key.substring(2)] = value;
    } else if (arg.startsWith('-')) {
      // TODO
    } else {
      argv.push(arg);
    }
  }

  return { parsed, argv };
};
