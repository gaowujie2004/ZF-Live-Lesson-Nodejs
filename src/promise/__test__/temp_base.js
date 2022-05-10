'use strict';
exports.__esModule = true;
var base_1 = require('../base');

console.log(base_1._Promise);

base_1._Promise.deferred = function () {
  var result = {};
  result.promise = new base_1._Promise(function (resolve, reject) {
    result.resolve = resolve;
    result.reject = reject;
  });

  return result;
};

module.exports = base_1._Promise;
