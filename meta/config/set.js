'use strict';

const config = require('../../config.js');
const output = require('../../output.js');

exports.cmdObj = {
    use: 'arc config set',
    usage:[
        'arc config set <key> [value] [--profile profileName]'
    ],
    args: [
        {
            name:'key',
            required:true,
        },
        {
            name:'value',
            required:true
        }
    ]
};

exports.run = function (args) {
    console.log(args._);
    if (!args._[1]){
        delete config.profile[args._[0]];
    }else{
        config.profile[args._[0]]=args._[1];
    }
    config.updateProfile(config.profileName,config.profile);
};