#!/usr/bin/env node

// AlibabaCloud Resourcify CLI

'use strict';

const path = require('path');

const { printUsage } = require('../helper.js');

const argv = process.argv.slice(2);

if (argv.length === 0) {
    printUsage();
    process.exit(0);
}

const [command] = argv;

switch (command) {
    case 'version':
        const pkg = require('../package.json');
        console.log(`arc version ${pkg.version}`);
        process.exit(0);
        break;
    case 'help':
        printUsage();
        process.exit(0);
        break;
    default:
        break;
}

// arc product resource_type action --parameter-name=value
const [product, resourceType, action, ...args] = argv;

const products = require('../products.js');

if (!products.has(product)) {
    console.error(`product(${product}) is not registered in CLI.`);
    process.exit(-1);
}

const resourceTypes = products.get(product);

if (!resourceTypes.has(resourceType)) {
    console.error(`product(${product})/${resourceType} is not registered in CLI.`);
    process.exit(-1);
}

const actions = resourceTypes.get(resourceType);

if (!actions.has(action)) {
    console.error(`product(${product})/${resourceType}/${action} is not registered in CLI.`);
    process.exit(-1);
}

function loadMethod(product, resourceType, action) {
    const m = require(path.join(__dirname, '../meta', product, resourceType));
    return m[action];
}

function resolveParameters(args) {
    return {};
}

const method = loadMethod(product, resourceType, action);
const parameters = resolveParameters(args);
method(parameters).then((result) => {
    console.log(result);
});
