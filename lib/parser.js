'use strict';

const path = require('path');
const fs = require('fs');
const rootCmd = require('../cmds/meta.js');
let config = require('./config.js');
let i18n = require('./i18n.js');


class Parse {
  constructor(ctx) {
    this.args = ctx['args'];
    this.cmdFilePath = ctx.cmdFilePath;
    this.profileName = ctx.profileName;
    this.profile = ctx.profile;
    this.parsedValue = {};
    this.mappingValue = {};
    this.relationCheckList = [];
    this.cmds = [];
    this.help = false;
  }

  parse() {
    let parserCtx = this.cmdParser(this.args, this.cmdFilePath);
    this.cmds=parserCtx.cmds;
    this.help=parserCtx.help;
    this.args=parserCtx.args;
    this.cmdFilePath=path.join(this.cmdFilePath, ...this.cmds) + '.js';
    let cmd = require(this.cmdFilePath);
    if (this.help){
      return;
    }
    if (!cmd.run){
      this.help=true;
      return;
    }
    let argvCtx=this.argvParse(this.args);
    this.args=argvCtx.args;
    this.argv=argvCtx.argv;

  }

  cmdParser(args, cmdFilePath) {
    let help = false;
    let cmds = [];
    let index = 0;

    for (; index < args.length; index++) {
      let arg = args[index];
      let tempPath = path.join(cmdFilePath, ...cmds, arg + '.js');
      if (fs.existsSync(tempPath)) {
        cmds.push(arg);
        continue;
      }
      if (arg === 'help') {
        help = true;
      }
      break;
    }
    if (args.length === cmds.length) {
      args = [];
    } else {
      args = args.slice(index);
    }
    return { args, cmds, help };
  }

  argvParse(args) {
    let argv = [];
    if (args.length === 0) {
      return { args, argv };
    }
    let index = 0;
    for (; index < args.length; index++) {
      if (args[index].startsWith('-')) {
        break;
      }
      argv.push(args[index]);
    }
    if (args.length === argv.length) {
      args = [];
    } else {
      args = args.slice(index);
    }
    return { args, argv };
  }

  transOpt(options,opts){
    let opts={ _required: [], _optional: [], _transed: [], _unchanged: [] };
    for (let optName of Object.keys(options||{})){
      if (opts[optName]){
        continue
      }
      let option=options[optName]
      
    }
  }

  addAlias(options){
    for (let optName of Object.keys(options||{})){
      let option=options[optName]
      
    }
  }

  parseFlag(args) {
    for (; ;) {
      if (args.length === 0) {
        break;
      }
      // let index = 0;
      args = this.parseOne(args);
      if (args.err) {
        return { err: args.err };
      }
    }
  }
  parseOne(args) {
    let arg = args[0];
    let miners = 1;
    if (arg[1] === '-') {
      miners = 2;
    }
    arg = arg.slice(miners);
    let argSlice = arg.split('=', 2);
    let optName = argSlice[0];
    let input = [];
    if (argSlice.length === 2) {
      if (argSlice[1] === undefined) {
        return {
          err: {
            prompt: i18n.syntaxErr,
            values: ['-'.repeat(miners) + optName]
          }
        };
      }
      input.push(argSlice[1]);
    }
    args = args.slice(1);
    let index = 0;
    for (; index < args.length; index++) {
      if (args[index].startsWith('-')) {
        // next = true;
        break;
      }
      input.push(args[index]);
    }
    let obj = this.parsedValue;
    let names = optName.split('.');
    let options = this.cmdObj.options;
    let option;
    let currentOptName = '';
    for (let i = 0; i < names.length; i++) {
      currentOptName = names[i]; // worker-data-disks
      if (option && option.vtype === 'array') {
        option = {
          vtype: option.subType,
          options: option.options
        };
        currentOptName = +currentOptName;
        if (isNaN(currentOptName)) {
          return {
            err: {
              prompt: i18n.unknowFlag,
              values: [currentOptName]
            }
          };
        }
      } else {
        option = options[currentOptName];
        if (!options[currentOptName]) { // flase
          return {
            err: {
              prompt: i18n.unknowFlag,
              values: ['--' + names.join('.')]
            }
          };
        }
      }
      options = option.options;

      let values = this.initValue(option.vtype);
      if (obj[currentOptName] === undefined) {
        if (Array.isArray(obj)) {
          obj.push(values);
        } else {
          obj[currentOptName] = values;
        }
      }
      if (values !== '') {
        obj = obj[currentOptName];
      }
    }
    let result = this.processValue(obj, option, currentOptName, input);
    if (result) {
      result.err.values.push('--' + names.join('.'));
      return { err: result.err };
    }
    return args.slice(index);
  }

  processValue(obj, option, flagName, input) {
    if (!option.vtype) {
      option.vtype = 'string';
    }
    let result;
    switch (option.vtype) {
    case 'string':
      result = this.processString(input);
      break;
    case 'boolean':
      result = this.processBoolean(input);
      break;
    case 'number':
      result = this.processNumber(input);
      break;
    case 'map':
      result = this.processMap(option, input);
      break;
    case 'array':
      result = this.processArray(option, input);
    }
    if (result.err && result.err.prompt) {
      return { err: result.err };
    }
    obj[flagName] = result.value;
  }

  processString(input) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    return { value: input[0] };
  }

  processBoolean(input) {
    let err = {};
    if (input.length === 0) {
      return { value: true };
    }
    if (input.length === 1) {
      switch (input[0]) {
      case 'true':
        return { value: true };
      case 'false':
        return { value: false };
      }
    }
    err = {
      prompt: i18n.vTypeMatchErr,
      values: []
    };
    return { err };
  }

  processNumber(input) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    let value = +input[0];
    if (isNaN(value)) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    return { value };
  }

  processMap(input) {
    if (input.length !== 1) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    let value = {};
    if (input[0].startsWith('{')) {
      try {
        value = JSON.parse(input[0]);
      } catch (error) {
        let err = {
          prompt: i18n.resolveErr,
          values: []
        };
        return { err };
      }
    } else {
      let values = input[0].split(',');
      for (let data of values) {
        let pair = data.split('=');
        if (pair.length === 1) {
          let err = {
            prompt: i18n.vTypeMatchErr,
            values: []
          };
          return { err };
        }
        value[pair[0]] = pair[1];
      }
    }
    return { value };
  }

  processArray(option, input) {
    if (input.length === 0) {
      let err = {
        prompt: i18n.vTypeMatchErr,
        values: []
      };
      return { err };
    }
    let value = [];
    if (input[0].startsWith('[')) {
      if (input.length !== 1) {
        let err = {
          prompt: i18n.mixInputErr,
          values: []
        };
        return { err };
      }
      try {
        value = JSON.parse(input[0]);
      } catch (error) {
        let err = {
          prompt: i18n.resolveErr,
          values: []
        };
        return { err };
      }
    } else {
      let result = {};
      switch (option.subType) {
      case 'string':
      case 'number':
        result['value'] = input;
        break;
      case 'map':
        result = this.processMapArray(option, input);
        break;
      }
      if (result.err && result.err.prompt) {
        return { err: result.err };
      }
      value = result.value;
    }
    if (option.subType === 'number') {
      let ok = this.numberCheck(value);
      if (!ok) {
        let err = {
          prompt: i18n.vTypeMatchErr,
          values: []
        };
        return { err };
      }
    }
    return { value };
  }
  processMapArray(option, input) {
    let value = [];
    for (let data of input) {
      let result = this.processMap(option, [data]);
      if (result.err && result.err.prompt) {
        return { err: result.err };
      }
      value.push(result.value);
    }
    return { value };
  }
  numberCheck(input) {
    for (let val of input) {
      let num = +val;
      if (isNaN(num)) {
        return false;
      }
    }
    return true;
  }

  initValue(type) {
    switch (type) {
    case 'string':
    case 'number':
    case 'boolean':
      return '';
    case 'array':
      return [];
    case 'map':
      return {};
    }

  }
}
module.exports = Parse;



// function cmdParser(args, cmdFilePath) {
//   let help = false;
//   let cmds = [];
//   let index = 0;

//   for (; index < args.length; index++) {
//     let arg = args[index];
//     let tempPath = path.join(cmdFilePath, ...cmds, arg + '.js');
//     if (fs.existsSync(tempPath)) {
//       cmds.push(arg);
//       continue;
//     }
//     if (arg === 'help') {
//       help = true;
//     }
//     break;
//   }
//   if (args.length === cmds.length) {
//     args = [];
//   } else {
//     args = args.slice(index);
//   }
//   return { args, cmds, help };
// }

// function argvParse(args) {
//   let argv = [];
//   if (args.length === 0) {
//     return { args, argv };
//   }
//   let index = 0;
//   for (; index < args.length; index++) {
//     if (args[index].startsWith('-')) {
//       break;
//     }
//     argv.push(args[index]);
//   }
//   if (args.length === argv.length) {
//     args = [];
//   } else {
//     args = args.slice(index);
//   }
//   return { args, argv };
// }


// function processString(flagName, input) {
//   if (input.length !== 1) {
//     let err = {
//       prompt: i18n.vTypeMatchErr,
//       values: [flagName]
//     };
//     return { err };
//   }
//   return { value: input[0] };
// }

// function processBoolean(flagName, input) {
//   let err = {};
//   if (input.length === 0) {
//     return { value: true };
//   }
//   if (input.length === 1) {
//     switch (input[0]) {
//     case 'true':
//       return { value: true };
//     case 'false':
//       return { value: false };
//     }
//   }
//   err = {
//     prompt: i18n.vTypeMatchErr,
//     values: [flagName]
//   };
//   return { err };
// }

// function processNumber(flagName, input) {
//   if (input.length !== 1) {
//     let err = {
//       prompt: i18n.vTypeMatchErr,
//       values: [flagName]
//     };
//     return { err };
//   }
//   let value = +input[0];
//   if (isNaN(value)) {
//     let err = {
//       prompt: i18n.vTypeMatchErr,
//       values: [flagName]
//     };
//     return { err };
//   }
//   return { value };
// }

// function processMap(flagName, flag, input) {
//   if (input.length !== 1) {
//     let err = {
//       prompt: i18n.vTypeMatchErr,
//       values: [flagName]
//     };
//     return { err };
//   }
//   let value = {};
//   let mappingValue;
//   if (input[0].startsWith('{')) {
//     try {
//       value = JSON.parse(input[0]);
//     } catch (error) {
//       let err = {
//         prompt: i18n.resolveErr,
//         values: [flagName, error.message]
//       };
//       return { err };
//     }
//   } else {
//     let values = input[0].split(',');
//     for (let data of values) {
//       let pair = data.split('=');
//       if (pair.length === 1) {
//         let err = {
//           prompt: i18n.vTypeMatchErr,
//           values: [flagName]
//         };
//         return { err };
//       }
//       value[pair[0]] = pair[1];
//     }
//   }
//   if (flag.mappingType) {
//     let mappingObj = new flag.mappingType(value);
//     if (Object.keys(value).length !== Object.keys(mappingObj).length) {
//       let err = {
//         prompt: i18n.filedErr,
//         values: [flagName]
//       };
//       return { err };
//     }
//     mappingValue = mappingObj;
//   } else {
//     mappingValue = value;
//   }
//   return { value: mappingValue };
// }

//  numberCheck(input) {
//   for (let val of input) {
//     let num = +val;
//     if (isNaN(num)) {
//       return false;
//     }
//   }
//   return true;
// }

// function processMapArray(flagName, flag, input) {
//   let value = [];
//   for (let data of input) {
//     let result = processMap(flagName, flag, [data]);
//     if (result.err && result.err.prompt) {
//       return { err: result.err };
//     }
//     value.push(result.value);
//   }
//   return { value };
// }



// function processValue(flagName, input) {
//   let flag = opts[flagName];
//   if (!flag.vtype) {
//     flag.vtype = 'string';
//   }
//   let result;
//   let err = {};
//   switch (flag.vtype) {
//   case 'string':
//     result = processString(flagName, input);
//     break;
//   case 'boolean':
//     result = processBoolean(flagName, input);
//     break;
//   case 'number':
//     result = processNumber(flagName, input);
//     break;
//   case 'map':
//     result = processMap(flagName, flag, input);
//     break;
//   case 'array':
//     result = processArray(flagName, flag, input);
//     break;
//   default:
//     err = {
//       prompt: i18n.unrecognizedVType,
//       values: []
//     };
//     return { err };
//   }
//   if (result.err && result.err.prompt) {
//     return { err: result.err };
//   }
//   return { value: result.value };
// }




// function flagsParser(args) {
//   let parsedValue = {};
//   let mappingValue = {};
//   for (; ;) {
//     if (args.length === 0) {
//       break;
//     }
//     let result = exports.parseOne(args);
//     if (result.err && result.err.prompt) {
//       return { err: result.err };
//     }
//     if (opts[result.flagName].mapping) {
//       mappingValue[opts[result.flagName].mapping] = result.value;
//     }
//     parsedValue[opts[result.flagName].name] = result.value;
//     if (!result.next) {
//       break;
//     }
//     args = result.args;
//   }
//   return { parsedValue, mappingValue };
// }