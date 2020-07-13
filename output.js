'use strict';

exports.result = '';
exports.errorMsg = '';

exports.log = function (data) {
    exports.result += data;
};

exports.error = function (message) {
    console.log(message);
    exports.errorMsg += message;
};