'use strict';

const tpl = tplHead`'use strict';
const mapping = new Map();
`;

const tplEnd= `
module.exports = mapping;
`;

// scan meta folder

const dirs = fs.readdir(path.join(__dirname, 'meta'));
const mapping = new Map();

dirs.forEach(item => {
    const resourceTypes = fs.readdir(path.join(__dirname, 'meta', item));
    const resourceTypesMap = new Map();
    resourceTypes.forEach(ritem => {
        const clazz = require(path.join(__dirname, 'meta', item));
        const actions = new Map();
        actions.set(name, true);
        resourceTypesMap.set(ritem, actions);
    })
    mapping.set(item, resourceTypesMap);
});

// 迭代 mapping

let output = '';

fs.writeFileSync(path.join(__dirname, './products.js'), output);
