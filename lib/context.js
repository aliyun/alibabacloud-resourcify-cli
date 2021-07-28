'use strict';

const Parser = require('./parser');
const Config = require('./config');

function loadContext(args) {
  const parser = new Parser();
  parser.parse(args);
  const ctx = {};
  const config = new Config();
  const { name, profile } = config.getProfile();
  ctx['profileName'] = name;
  ctx['profile'] = profile;

  if (parser.parsedValue.profile) {
    const { name, profile } = config.getProfile(parser.parsedValue.profile);
    ctx['profileName'] = name;
    ctx['profile'] = profile;
  }

  ctx['mappingValue'] = parser.mappingValue;

  return ctx;
}

module.exports = {
  loadContext
};
