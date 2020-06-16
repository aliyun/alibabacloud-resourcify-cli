'use strict';
const readline = require('readline-sync');
const { updateProfile } = require('../config.js');
function Run(cmd, args) {
    let profile = {};
    let name;
    if (!args.profile) {
        name = readline.question('profile name: ');
    } else {
        name = args.profile;
    }
    if (!args.mode) {
        profile['mode'] = readline.question('mode: ');
    } else {
        profile['mode'] = args.mode;
    }
    switch (profile['mode']) {
        case 'AK':
            profile['access_key_id'] = readline.question('Access Key ID: ');
            profile['access_key_secret'] = readline.question('Access Key Secret: ');
            break;
        case 'StsToken':
            profile['access_key_id'] = readline.question('Access Key ID: ');
            profile['access_key_secret'] = readline.question('Access Key Secret: ');
            profile['sts_token'] = readline.question('Sts Token: ');
            break;
    }
    profile['region'] = readline.question('Default Region ID: ');
    updateProfile(name, profile);
}

function flagPrepare() {
    // TODO 
}

module.exports = {
    Run,
    flagPrepare
};