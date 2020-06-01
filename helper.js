'use strict';

exports.printUsage = function () {
    const command = 'arc';
    console.log('usage:');
    console.log(`    ${command} version`);
    console.log(`    ${command} help`);
    console.log(`    ${command} <product> <resourceType> <action> [parameters]`);
    console.log();
}
