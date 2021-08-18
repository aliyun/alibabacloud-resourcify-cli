'use strict';

const { default: Credential, Config } = require('@alicloud/credentials');
const { RuntimeOptions } = require('@alicloud/tea-util');
const output = require('./output.js');

exports.getConfigOption = async function (profile) {
  if (profile.access_key_id && profile.access_key_secret) {
    profile['mode'] = 'AK';
    if (profile.sts_token) {
      profile['mode'] = 'StsToken';
    } else if (profile.ram_role_arn) {
      profile['mode'] = 'RamRoleArn';
    }
  } else if (profile.ecs_ram_role) {
    profile['mode'] = 'EcsRamRole';
  }
  let config;
  if (!profile.mode) {
    output.error('The current profile is incomplete and cannot be invoked\n');
  }
  switch (profile['mode']) {
  case 'AK':
    config = new Config({
      type: 'access_key',
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret
    });
    break;
  case 'StsToken':
    config = new Config({
      type: 'sts',
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      securityToken: profile.sts_token
    });
    break;
  default:
    console.error('The credential information is incomplete, please confirm the credential information');
    console.log(profile);
    process.exit(-1);
  }
  const cred = new Credential(config);
  profile.type = config.type;
  profile.access_key_id = await cred.getAccessKeyId();
  profile.access_key_secret = await cred.getAccessKeySecret();
  profile.sts_token = await cred.getSecurityToken();
  return profile;
};

exports.getRuntimeOption = function (argv) {
  return new RuntimeOptions({
    readTimeout: 10000
  });
};