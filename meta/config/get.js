'use strict';

const config = require('../../config.js');
const output = require('../../output.js');

exports.cmdObj = {
    use: 'arc config get',
    args: [
        {
            name: 'profile'
        }
    ]
};

exports.run = function (args) {
    config.getProfile(args._[0]);
    let data = JSON.stringify(config.profile, null, 2);
    output.log(data);
};