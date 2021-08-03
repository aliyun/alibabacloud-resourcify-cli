'use strict';

function getOption(options, alias) {
  const keys = Object.keys(options);
  for (let j = 0; j < keys.length; j++) {
    const key = keys[j];
    const option = options[key];
    if (option.alias === alias) {
      return key;
    }
  }

  return null;
}

exports.parse = function (args, options) {
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
      let alias, value;
      if (arg.indexOf('=') !== -1) {
        [alias, value] = arg.split('=');
      } else {
        alias = arg;
        const next = args[i+1];
        if (!next || next.startsWith('-')) {
          value = undefined;
        } else {
          value = next;
          i++;
        }
      }

      const key = getOption(options, alias.substring(1));
      if (key) {
        parsed.set(key, value);
      }
    } else {
      argv.push(arg);
    }
  }

  return { parsed, argv };
};
