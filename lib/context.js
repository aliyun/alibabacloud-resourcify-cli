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

  if (ctx.parsed.get(profile)) {
    const { name, profile } = config.getProfile(ctx.parsed.get('profile'));
    ctx['profileName'] = name;
    ctx['profile'] = profile;
  }

  ctx['mappingValue'] = {}; // parser.mappingValue;

  return ctx;
}

module.exports = {
  loadContext
};
