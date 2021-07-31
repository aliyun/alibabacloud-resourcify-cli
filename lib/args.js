'use strict';

exports.parse = function (args, def) {
  const parsed = new Map();
  const argv = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      if (arg.indexOf('=') !== -1) {
        const [key, value] = arg.split('=');
        parsed.set(key.substring(2), value);
      } else {
        const next = args[i+1];
        if (!next || next.startsWith('-')) {
          parsed.set(arg.substring(2), undefined);
        } else {
          parsed.set(arg.substring(2), next);
          i++;
        }
      }
    } else if (arg.startsWith('-')) {
      // TODO
    } else {
      argv.push(arg);
    }
  }

  return { parsed, argv };
};
