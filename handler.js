'use strict';

const { RuntimeOptions } = require('@alicloud/tea-util');
let paramRequest;
module.exports = function (cmd, args) {
    let [sdk, actionCode] = cmd.mapping.split('/');
    let { default: Client } = require(`@alicloud/${sdk}`);
    let actionRequest = require(`@alicloud/${sdk}`)[`${actionCode}Request`];
    let action = actionCode.replace(/^./, s => s.toLowerCase());
    if (!cmd.configPackage || cmd.configPackage === 'self') {
        cmd.configPackage = `@alicloud/${sdk}`;
    }
    let { Config } = require(cmd.configPackage);
    let config = new Config({
        accessKeyId: process.env.ALIBABACLOUD_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIBABACLOUD_ACCESS_KEY_SECRET,
        regionId: 'cn-hangzhou'
    });
    let request = new actionRequest({
    });
    // 处理来自options的参数
    const optionParams = cmd.param;
    for (const param in optionParams) {
        if (!args[param]) {
            continue;
        }
        if (optionParams[param].param && optionParams[param].vType === 'list') {
            paramRequest=require(`@alicloud/${sdk}`)[`${actionCode}Request${optionParams[param].mapping}`];
            args[param]=transParamList(optionParams[param], args);
        }

        request[optionParams[param].mapping] = args[param];

    }
    //处理来自args的参数
    const argsParams = cmd.args;
    let argsIndex = 0;
    for (const param in argsParams) {
        if (param.startsWith('_')) {
            continue;
        }
        if (!args._[argsIndex]) {
            break;
        }
        switch (argsParams[param]) {
            case 'jsonList':
                request[param] = JSON.stringify(args._);
                break;
            case 'string':
                request[param] = args._[argsIndex];
        }
        argsIndex++;
    }
    let client = new Client(config);
    let runtime = new RuntimeOptions({
    });
    client[action](request, runtime).then(result => {
        let data = JSON.stringify(result, null, 2);
        console.log(data);
    }).catch(e => {
        console.log(e.message);
    });
};

function transParamList(option, args) {
    let params = option.param;
    let index=0;
    let tempList=new Array();

    for (; ;index++) {
        let next = false;
        tempList[index]=new paramRequest({});
        for (var param in params){
            if (args[param][index]){
                tempList[index][params[param].mapping]=args[param][index];
                next=true;
            }
        }
        if (!next){
            break;
        }
    }
    return tempList.slice(0,index);
}