'use strict';
const output=require('../../../output.js');
exports.cmdObj={
    use:'arc version',
    desc:{
        zh:'获取当前程序版本'
    }
};

exports.run=function(){
    let info=require('../package.json');
    output.log(info.version);
};