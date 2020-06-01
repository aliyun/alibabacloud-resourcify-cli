const mapping = new Map();

const resourceTypes = new Map();
const actions = new Map();
actions.set('list', true);
resourceTypes.set('region', actions);
mapping.set('ecs', resourceTypes);

module.exports = mapping;
