'use strict';
const inquirer = require('inquirer');
const util = require('util');
let i18n = require('./i18n.js');

let language = 'zh';


class Interactive {
  constructor(ctx) {
    this.cmdFilePath = ctx.cmdFilePath;
    this.profileName = ctx.profileName;
    this.profile = ctx.profile;
    this.language = ctx.profile.language;
    this.transed = [];
  }
  transOpts(options) {
    let opts = { required: [] };
    if (!options) {
      return opts;
    }
    // index 顺序
    for (let optName of Object.keys(options)) {
      if (this.transed.includes(optName)) {
        continue;
      }
      let option = options[optName];
      if (option.required) {
        opts.required.push(optName);
      }
    }
    this.relationTrans();
  }
  relationTrans(option) {
    if (!option.relations) {
      return;
    }
    for (let relation of option.relations) {
      console.log(relation);
    }
  }

}
module.exports = Interactive;

// function transOpts(options) {
//   let opts = { required: [] };
//   if (!options) {
//     return opts;
//   }
//   let _transed = [];
//   // index 顺序
//   for (let optName of Object.keys(options)) {
//     if (_transed.includes(optName)) {
//       continue;
//     }
//     let option = options[optName];
//     if (option.required) {
//       opts.required.push(optName);
//     }

//   }
// }



// function isEmpty(val) {
//   if (!val || val === '') {
//     return i18n.emptyValueErr[language];
//   }
//   return '';
// }

// function isNumber(val) {
//   let value = +val;
//   if (isNaN(value)) {
//     return i18n.notNumberErr[language];
//   }
//   return '';
// }

// function processlineWeight(message) {
//   var ui = require('cliui')({ width: 80 });
//   ui.div({
//     text: message,
//     padding: [0, 0, 0, 0],
//   });
//   return ui.toString();
// }

// async function argsInteractively(cmd) {
//   let questions = [];
//   for (let arg of cmd.args) {
//     let question = {
//       type: 'input',
//       name: arg.name,
//       message: arg.name,
//     };
//     if (arg.required) {
//       let lan = i18n.emptyValueErr[language];
//       question['validate'] = function (val) {
//         if (val === '') {
//           return lan;
//         }
//         return true;
//       };
//     }
//     questions.push(question);
//   }
//   let answers = await inquirer.prompt(questions);
//   return answers;
// }

// async function processString(optionName, optionObj, required) {
//   let question = {
//     name: optionName,
//     message: processlineWeight(optionObj.desc[language] + '\n' + optionName)
//   };
//   if (optionObj.default) {
//     question.default = optionObj.default;
//   }
//   if (optionObj.filter) {
//     question.filter = optionObj.filter;
//   }
//   if (optionObj.choices) {
//     question['type'] = 'list';
//     question['choices'] = [...optionObj.choices];
//     if (!required) {
//       question['choices'].push('[UNSET]');
//       question['filter'] = function (val) {
//         if (val === '[UNSET]') {
//           return undefined;
//         }
//         return val;
//       };
//     }
//   } else {
//     question['type'] = 'input';
//   }
//   if (required) {
//     question['validate'] = function (val) {
//       let err = isEmpty(val);
//       if (err) {
//         return err;
//       }
//       return true;
//     };
//   }
//   let answer = await inquirer.prompt([question]);
//   return answer[optionName];
// }

// async function processNumber(optionName, optionObj, required) {
//   let question = {
//     name: optionName,
//     message: processlineWeight(optionObj.desc[language] + '\n' + optionName)
//   };
//   if (optionObj.default) {
//     question.default = optionObj.default;
//   }
//   if (optionObj.filter) {
//     question.filter = optionObj.filter;
//   }
//   if (optionObj.choices) {
//     question['type'] = 'list';
//     question['choices'] = optionObj.choices;
//     if (!required) {
//       question['choices'].push('[UNSET]');
//       question['filter'] = function (val) {
//         if (val === '[UNSET]') {
//           return undefined;
//         }
//         return val;
//       };
//     }
//   } else {
//     question['type'] = 'input';
//   }
//   if (required) {
//     question['validate'] = function (val) {
//       let err = isEmpty(val);
//       if (err) {
//         return err;
//       }
//       err = isNumber(val);
//       if (err) {
//         return err;
//       }
//       return true;
//     };
//   } else {
//     question['validate'] = function (val) {
//       let err = isNumber(val);
//       if (err) {
//         return err;
//       }
//       return true;
//     };
//   }
//   let answer = await inquirer.prompt([question]);
//   return +answer[optionName];
// }

// async function processBoolean(optionName, optionObj, required) {
//   let question = {
//     type: 'list',
//     name: optionName,
//     message: processlineWeight(optionObj.desc[language] + '\n' + optionName)
//   };
//   if (optionObj.default) {
//     question.default = optionObj.default;
//   }
//   if (optionObj.filter) {
//     question.filter = optionObj.filter;
//   }
//   question['type'] = 'list';
//   question['choices'] = [
//     'true',
//     'false'
//   ];
//   if (!required) {
//     question['choices'].push('[UNSET]');
//     question['filter'] = function (val) {
//       if (val === '[UNSET]') {
//         return undefined;
//       }
//       return val;
//     };
//   }
//   let answer = await inquirer.prompt([question]);
//   if (answer[optionName]) {
//     if (answer[optionName] === 'true') {
//       return true;
//     }
//     return false;
//   }
//   return answer[optionName];

// }

// async function processArray(optionName, optionObj, required) {
//   let values = [];
//   console.log(processlineWeight(optionObj.desc[language]));
//   if (!required) {
//     let question = {
//       type: 'confirm',
//       name: 'isConfig',
//       message: util.format(i18n.isConfigPromt[language], optionName)
//     };
//     let answer = await inquirer.prompt([question]);
//     if (!answer['isConfig']) {
//       return undefined;
//     }
//   }
//   let index = 1;
//   for (; ;) {
//     let value;
//     // eslint-disable-next-line
//     let val = await optionsInteract(optionObj.options);
//     if (optionObj.subType === 'map') {
//       if (optionObj.mappingType) {
//         value = new optionObj.mappingType(val);
//       } else {
//         value = val;
//       }
//     } else {
//       value = val.element;
//     }
//     if (value !== undefined) {
//       values.push(value);
//     }
//     if (optionObj.maxindex) {
//       if (index >= optionObj.maxindex) {
//         break;
//       }
//     }
//     let question = {
//       type: 'confirm',
//       name: 'isConfig',
//       message: util.format(i18n.continueConfigPromt[language], optionName)
//     };
//     let answer = await inquirer.prompt([question]);
//     if (!answer['isConfig']) {
//       break;
//     }
//     index++;
//   }
//   console.log('');
//   return values;
// }

// async function processMap(optionName, optionObj, required) {
//   console.log(processlineWeight(optionObj.desc[language]));
//   if (!required) {
//     let question = {
//       type: 'confirm',
//       name: 'isConfig',
//       message: util.format(i18n.isConfigPromt[language], optionName)
//     };
//     let answer = await inquirer.prompt([question]);
//     if (!answer['isConfig']) {
//       return undefined;
//     }
//   }
//   // eslint-disable-next-line
//   let val = await optionsInteract(optionObj.options);
//   let value;
//   if (optionObj.mappingType) {
//     value = new optionObj.mappingType(val);
//   } else {
//     value = val;
//   }
//   return value;
// }

// async function paramInteract(optionName, optionObj, required) {
//   if (!optionObj.vtype) {
//     optionObj.vtype = 'string';
//   }
//   let value;
//   switch (optionObj.vtype) {
//   case 'string':
//     value = await processString(optionName, optionObj, required);
//     break;
//   case 'number':
//     value = await processNumber(optionName, optionObj, required);
//     break;
//   case 'boolean':
//     value = await processBoolean(optionName, optionObj, required);
//     break;
//   case 'array':
//     value = await processArray(optionName, optionObj, required);
//     break;
//   case 'map':
//     value = await processMap(optionName, optionObj, required);
//     break;
//   }
//   return value;
// }

// async function optionInteract(optionList, options, optVal, required) {
//   for (let value of optionList) {
//     let optionName;
//     if (Array.isArray(value)) {
//       let question = {
//         type: 'list',
//         name: 'flag',
//         message: i18n.conflictPromt[language],
//         choices: value
//       };
//       let answer = await inquirer.prompt([question]);
//       optionName = answer.flag;
//     } else {
//       optionName = value;
//     }
//     let val = await paramInteract(optionName, options[optionName], required);
//     if (options[optionName].sufficient) {
//       let fun = options[optionName].sufficient;
//       let optList = fun(val);
//       let subs = Object.keys(optList);
//       for (let key of subs) {
//         await optionInteract([key], options, optVal, optList[key]);
//       }
//     }
//     if (!val) {
//       continue;
//     }
//     optVal[optionName] = val;
//   }
// }

// async function optionsInteract(options) {
//   let optVal = {};
//   let opts = cliParser.transOpts(options);
//   await optionInteract(opts._required, options, optVal, true);
//   await optionInteract(opts._optional, options, optVal, false);
//   return optVal;
// }

// exports.runInteractively = async function (ctx) {
//   language = ctx.profile.language;
//   const rootCmd = ctx.rootCmdName;
//   let cmdFile = require(ctx.cmdFilePath);
//   if (cmdFile.preInteractive) {
//     cmdFile.preInteractive(ctx);
//   }
//   let cmd = cmdFile.cmdObj;
//   let mappingValue = {};
//   let argv = [];
//   if (cmd.args) {
//     let answer = await argsInteractively(cmd);
//     for (let arg of cmd.args) {
//       if (answer[arg.name]) {
//         argv.push(`${answer[arg.name]}`);
//       }
//     }
//   }
//   let cmdStr = rootCmd + ' ' + ctx.cmds.join(' ') + ' ' + argv.join(' ') + ' ';
//   let values = await optionsInteract(cmd.options);
//   let subs = Object.keys(values);
//   for (let key of subs) {
//     let value;
//     if (typeof values[key] === 'object') {
//       value = `'${JSON.stringify(values[key])}'`;
//     } else {
//       value = values[key];
//     }
//     cmdStr = cmdStr + `--${key} ${value} `;

//     if (cmd.options[key].mapping) {
//       mappingValue[cmd.options[key].mapping] = values[key];
//     } else {
//       mappingValue[key] = values[key];
//     }
//   }
//   console.log(cmdStr);
//   let question = {
//     type: 'confirm',
//     name: 'isRun',
//     message: i18n.isRunPromt[language],
//     default: false
//   };
//   let answer = await inquirer.prompt([question]);
//   return { isRun: answer.isRun, argv, parsedValue: values, mappingValue };
// };

