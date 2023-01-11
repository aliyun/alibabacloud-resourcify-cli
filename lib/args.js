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

function getMappingValue (options, parsed) {
  const mappingValue = {};

  const keys = Object.keys(options);
  let valueTmp;
  for (const key of keys) {
    const option = options[key];
    valueTmp = mappingValue;
    if (!option || !option.mapping) {
      continue;
    }

    const value = parsed.get(key);
    const mappingNames = option.mapping.split('.');
    const name = mappingNames[mappingNames.length - 1];
    for (let i = 0; i < mappingNames.length - 1; i++) {
      if (!valueTmp[mappingNames[i]]) {
        valueTmp[mappingNames[i]] = {};
      }
      valueTmp = valueTmp[mappingNames[i]];
    }

    // 赋值
    if (option.options) {
      if (option.vtype === 'array') {
        const arrayValues = [];
        for (const v of value) {
          const value = getMappingValue(option.options, v);
          arrayValues.push(value);
        }
        valueTmp[name] = arrayValues;
      } else {
        valueTmp[name] = getMappingValue(option.options, value);
      }
    } else {
      if (name) {
        valueTmp[name] = value;
        continue;
      }
    }
  }

  return mappingValue;
}

exports.getMappingValue = getMappingValue;
