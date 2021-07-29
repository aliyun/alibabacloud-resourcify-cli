'use strict';

const Config = require('./config');
const { parse } = require('./args');

function loadContext(args) {
  const ctx = {};
  const config = new Config();
  const { name, profile } = config.getProfile();
  ctx['profileName'] = name;
  ctx['profile'] = profile;

  const { parsed, argv } = parse(args);
  ctx['parsed'] = parsed;
  ctx['argv'] = argv;

  if (ctx['parsed'].profile) {
    const { name, profile } = config.getProfile(ctx['parsed'].profile);
    ctx['profileName'] = name;
    ctx['profile'] = profile;
  }

  ctx['mappingValue'] = {}; // parser.mappingValue;

  return ctx;
}

module.exports = {
  loadContext
};
