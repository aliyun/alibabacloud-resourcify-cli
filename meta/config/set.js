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
            name:'value'
        }
    ]
};

exports.run = function (args) {
    if (!args._[1]){
        config.profile.delete[args._[0]];
    }else{
        config.profile[args._[0]]=args._[1];
    }
    console.log(config.profileName);
    config.updateProfile(config.profileName,config.profile);
};