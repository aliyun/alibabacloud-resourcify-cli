'use strict';
const config = require('./config.js');
const inquirer = require('inquirer');
const util = require('util');
let cliParser = require('./parser.js');
let i18n = require('./i18n.js');

exports.runInteractively = async function () {
  const { rootCmd } = require('./arc_config.js');
  let cmd = require(cliParser.argv._descFilePath).cmdObj;
  if (cmd.args) {
    let answer = await argsInteractively(cmd);
    for (let arg of cmd.args) {
      if (answer[arg.name]) {
        cliParser.argv._.push(`${answer[arg.name]}`);
      }
    }
  }
  let cmdStr = rootCmd + ' ' + cliParser.argv._cmds.join(' ') + ' ' + cliParser.argv._.join(' ') + ' ';
  let values = await optionsInteract(cmd.options);
  let mappingValues = {};
  for (let key in values) {
    let value;
    if (typeof values[key] === 'object') {
      value = `'${JSON.stringify(values[key])}'`;
    } else {
      value = values[key];
    }
    cmdStr = cmdStr + `--${key} ${value} `;

    if (cmd.options[key].mapping) {
      mappingValues[cmd.options[key].mapping] = values[key];
    } else {
      mappingValues[key] = values[key];
    }
  }
  cliParser.argv._parsedValue = values;
  cliParser.argv._mappingValue = mappingValues;
  cliParser.argv._inputCmd = cmdStr;
  let question = {
    type: 'confirm',
    name: 'isRun',
    message: i18n.isRunPromt[config.profile.language],
    default: false
  };
  let answer = await inquirer.prompt([question]);
  return answer.isRun;
};

async function optionsInteract(options) {
  let optVal = {};
  let opts = cliParser.transOpts(options);
  await optionInteract(opts._required, options, optVal, true);
  await optionInteract(opts._optional, options, optVal, false);
  return optVal;
}

async function optionInteract(optionList, options, optVal, required) {
  for (let value of optionList) {
    let optionName;
    if (Array.isArray(value)) {
      let question = {
        type: 'list',
        name: 'flag',
        message: i18n.conflictPromt[config.profile.language],
        choices: value
      };
      let answer = await inquirer.prompt([question]);
      optionName = answer.flag;
    } else {
      optionName = value;
    }
    let val = await paramInteract(optionName, options[optionName], required);
    if (options[optionName].sufficient) {
      let fun = options[optionName].sufficient;
      let optList = fun(val);
      for (let key in optList) {
        await optionInteract([key], options, optVal, optList[key]);
      }
    }
    if (!val) {
      continue;
    }
    optVal[optionName] = val;
  }
}


async function paramInteract(optionName, optionObj, required) {
  if (!optionObj.vtype) {
    optionObj.vtype = 'string';
  }
  let value;
  switch (optionObj.vtype) {
  case 'string':
    value = await processString(optionName, optionObj, required);
    break;
  case 'number':
    value = await processNumber(optionName, optionObj, required);
    break;
  case 'boolean':
    value = await processBoolean(optionName, optionObj, required);
    break;
  case 'array':
    value = await processArray(optionName, optionObj, required);
    break;
  case 'map':
    value = await processMap(optionName, optionObj, required);
    break;
  }
  return value;
}

async function processString(optionName, optionObj, required) {
  let question = {
    name: optionName,
    message: optionObj.desc[config.profile.language] + '\n' + optionName
  };
  if (optionObj.default) {
    question.default = optionObj.default;
  }
  if (optionObj.choices) {
    question['type'] = 'list';
    question['choices'] = [...optionObj.choices];
    if (!required) {
      question['choices'].push('[UNSET]');
      question['filter'] = function (val) {
        if (val === '[UNSET]') {
          return undefined;
        }
        return val;
      };
    }
  } else {
    question['type'] = 'input';
  }
  if (required) {
    question['validate'] = function (val) {
      let err = isEmpty(val);
      if (err) {
        return err;
      }
      return true;
    };
  }
  let answer = await inquirer.prompt([question]);
  return answer[optionName];
}

async function processNumber(optionName, optionObj, required) {
  let question = {
    name: optionName,
    message: optionObj.desc[config.profile.language] + '\n' + optionName
  };
  if (optionObj.default) {
    question.default = optionObj.default;
  }
  if (optionObj.choices) {
    question['type'] = 'list';
    question['choices'] = optionObj.choices;
    if (!required) {
      question['choices'].push('[UNSET]');
      question['filter'] = function (val) {
        if (val === '[UNSET]') {
          return undefined;
        }
        return val;
      };
    }
  } else {
    question['type'] = 'input';
  }
  if (required) {
    question['validate'] = function (val) {
      let err = isEmpty(val);
      if (err) {
        return err;
      }
      err = isNumber(val);
      if (err) {
        return err;
      }
      return true;
    };
  } else {
    question['validate'] = function (val) {
      let err = isNumber(val);
      if (err) {
        return err;
      }
      return true;
    };
  }
  let answer = await inquirer.prompt([question]);
  return +answer[optionName];
}

async function processBoolean(optionName, optionObj, required) {
  let question = {
    type: 'list',
    name: optionName,
    message: optionObj.desc[config.profile.language] + '\n' + optionName
  };
  if (optionObj.default) {
    question.default = optionObj.default;
  }
  question['type'] = 'list';
  question['choices'] = [
    'true',
    'false'
  ];
  if (!required) {
    question['choices'].push('[UNSET]');
    question['filter'] = function (val) {
      if (val === '[UNSET]') {
        return undefined;
      }
      return val;
    };
  }
  let answer = await inquirer.prompt([question]);
  if (answer[optionName]) {
    if (answer[optionName] === 'true') {
      return true;
    }
    return false;
  }
  return answer[optionName];

}

async function processArray(optionName, optionObj, required) {
  let values = [];
  console.log(optionObj.desc[config.profile.language]);
  if (!required) {
    let question = {
      type: 'confirm',
      name: 'isConfig',
      message: util.format(i18n.isConfigPromt[config.profile.language], optionName)
    };
    let answer = await inquirer.prompt([question]);
    if (!answer['isConfig']) {
      return undefined;
    }
  }
  let index = 1;
  for (; ;) {
    let value;
    let val = await optionsInteract(optionObj.options);
    if (optionObj.subType === 'map') {
      if (optionObj.mappingType) {
        value = new optionObj.mappingType(val);
      } else {
        value = val;
      }
    } else {
      value = val.element;
    }
    if (value !== undefined) {
      values.push(value);
    }
    if (optionObj.maxindex) {
      if (index >= optionObj.maxindex) {
        break;
      }
    }
    let question = {
      type: 'confirm',
      name: 'isConfig',
      message: util.format(i18n.continueConfigPromt[config.profile.language], optionName)
    };
    let answer = await inquirer.prompt([question]);
    if (!answer['isConfig']) {
      break;
    }
    index++;
  }
  console.log('');
  return values;
}

async function processMap(optionName, optionObj, required) {
  console.log(optionObj.desc[config.profile.language]);
  if (!required) {
    let question = {
      type: 'confirm',
      name: 'isConfig',
      message: util.format(i18n.isConfigPromt[config.profile.language], optionName)
    };
    let answer = await inquirer.prompt([question]);
    if (!answer['isConfig']) {
      return undefined;
    }
  }
  let val = await optionsInteract(optionObj.options);
  let value;
  if (optionObj.mappingType) {
    value = new optionObj.mappingType(val);
  } else {
    value = val;
  }
  return value;
}

async function argsInteractively(cmd) {
  let questions = [];
  for (let arg of cmd.args) {
    let question = {
      type: 'input',
      name: arg.name,
      message: arg.name,
    };
    if (arg.required) {
      question['validate'] = function (val) {
        if (val === '') {
          return i18n.emptyValueErr[config.profile.language];
        }
        return true;
      };
    }
    questions.push(question);
  }
  let answers = await inquirer.prompt(questions);
  return answers;
}

function isEmpty(val) {
  if (!val || val === '') {
    return i18n.emptyValueErr[config.profile.language];
  }
  return '';
}

function isNumber(val) {
  let value = +val;
  if (isNaN(value)) {
    return i18n.notNumberErr[config.profile.language];
  }
  return '';
}